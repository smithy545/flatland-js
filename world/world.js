var Class = require('../shared/class');
var Types = require('../shared/constants');
var Player = require('./player');
var Entity = require('./entity');
var EntityFactory = require('./entityfactory');
var Map = require('./map');
var Area = require('./area');
var fs = require('fs');
var path = require('path');

var World = Class.extend({
	init: function(name) {
		this.players = {};
		this.entities = {};
		this.entityId = 1;
		this.name = name;
		var mapFile = path.join(__dirname, "../shared/" + name + ".json");
		if(!fs.existsSync(mapFile)) {
			this.generateTerrain(mapFile, 1000, 1000);
		}
		this.map = new Map(mapFile);

		this.addEntity(EntityFactory.monster(5, 5));
	},
	welcomePlayer: function(name, id, socket) {
		var x, y;
		id = parseInt(id);
		if(!this.players[id]) {
			this.players[id] = new Player(name, id, socket);

			// find random unblocked spawn spot
			do {
				x = Math.floor(Math.random()*this.map.width);
				y = Math.floor(Math.random()*this.map.height);
			} while(this.map.blocked(x, y));

			// give commander
			this.addEntity(EntityFactory.person(id, x, y));
		}

		return this.players[id];
	},
	generateTerrain: function(mapFile, width, height) {
		var data;

		var splitFile = mapFile.split(".");
		var name = splitFile[splitFile.length - 2];

		data = {
			"name": name,
			"width": width,
			"height": height,
			"tilesize": 32,
			"tilesetWidth": 30,
			"tilesetHeight": 30,
			"tiles": []
		};
		// generate terrain here
		for(var i = 0; i < height*width; i++) {
			data["tiles"].push(767);
		}

		fs.writeFileSync(mapFile, JSON.stringify(data));
	},
	addEntity: function(e) {
		e.id = this.entityId++;
		e.setVisibleTo(e.owner, e.id);
		this.entities[e.id] = e;
		if(e.owner > 0) {
			this.players[e.owner].entities.push(e);
			this.players[e.owner].createDirtyArea();
		}
		this.updateVisible(e);
		this.map.registerEntity(e);
	},
	getEntity: function(id) {
		return this.entities[id];
	},
	sameTile: function(id1, id2) {
		var e1 = this.getEntity(id1),
			e2 = this.getEntity(id2);

		if(e1 && e2) {
			return e1.getX() == e2.getX() && e1.getY() == e2.getY();
		}
	},
	canOrder: function(ownerId, entityId) {
		return this.entities[entityId].owner == ownerId
	},
	canMove: function(id, x, y) {
		var e = this.entities[id];

		return Types.getKindAsString(e.type) == "actor"
			&& !this.map.blocked(x, y, e.getWidth(), e.getHeight())
			&& this.map.isNextTo(e, x, y);
	},
	broadcast: function() {
		// first arg should be entity, second be message, remaining be message args
		var args = Array.prototype.slice.call(arguments); // convert to array
		var entity = args.shift();
		var socket;

		for(var i in entity.visibleTo) {
			socket = this.players[entity.visibleTo[i]].socket;
			socket.emit.apply(socket, args);
		}
	},
	updateVisible: function(e) {
		// for new entity
		var visibleTo, couldSee;
		// check if players can see entity
		for(var id in this.players) {
			if(parseInt(id) !== e.owner) { // owner can always see
				visibleTo = this.players[id].whoCanSee(e);
				couldSee = e.visibleTo[id] && Object.keys(e.visibleTo[id]).length > 0;
				if(visibleTo.length > 0) { // if visible
					e.visibleTo[id] = {};
					for(var i = 0; i < visibleTo.length; i++) {
						e.setVisibleTo(id, visibleTo[i]);
					}
					if(!couldSee) { // if new entity
						this.players[id].socket.emit(Types.Messages.SPAWN, e.toSendable());
					}
				} else if(couldSee) { // if removing entity
					this.players[id].socket.emit(Types.Messages.DESPAWN, e.id);
				}
			}
		}

		// check if owner can see new entities
		var vr = Types.getViewDistance(e.type);
		var viewBox = new Area(e.x-vr, e.y-vr, 2*vr+1, 2*vr+1);
		var ent, viewable;
		for(var id in this.entities) {
			ent = this.entities[id];
			if(ent.owner != e.owner) { // if someone elses ent
				viewable = viewBox.collides(ent);
				if(ent.visibleTo[e.owner] && Object.keys(ent.visibleTo[e.owner]).length > 0) { // if owner could see before
					if(!ent.visibleTo[e.owner][e.id] && viewable) { // add this entity as being seen
						ent.setVisibleTo(e.owner, e.id);
					} else if(ent.visibleTo[e.owner][e.id] && !viewable) { // remove as being seen by e
						ent.setInvisibleTo(e.owner, e.id);
						if(Object.keys(ent.visibleTo[e.owner]).length == 0) { // despawn if last seeing entity
							this.players[e.owner].socket.emit(Types.Messages.DESPAWN, id);
						}
					}
				} else if(viewable) { // if couldn't see but can now
					ent.setVisibleTo(e.owner, e.id);
					this.players[e.owner].socket.emit(Types.Messages.SPAWN, ent.toSendable());
				}
			}
		}
	},
	updateVisibleAndMove: function(e) {
		var visibleTo, couldSee;
		// check if moved into sight of new player
		for(var id in this.players) {
			if(parseInt(id) !== e.owner) { // owner can always see
				visibleTo = this.players[id].whoCanSee(e);
				couldSee = Object.keys(e.visibleTo[id]).length > 0;
				if(visibleTo.length > 0) { // add to player view
					e.visibleTo[id] = {};
					for(var i = 0; i < visibleTo.length; i++) {
						e.setVisibleTo(id, visibleTo[i]);
					}

					if(couldSee) { // if visible move
						this.players[id].socket.emit(Types.Messages.MOVE, e.id, e.x, e.y);
					} else { // else spawn
						this.players[id].socket.emit(Types.Messages.SPAWN, e.toSendable());
					}
				} else if(couldSee) { // remove from player view
					e.visibleTo[id] = {};
					this.players[id].socket.emit(Types.Messages.DESPAWN, e.id);
				}
			} else { // move if owned
				this.players[id].socket.emit(Types.Messages.MOVE, e.id, e.x, e.y);
			}
		}
		// check if moved into/out of sight of new entity
		var vr = Types.getViewDistance(e.type);
		var viewBox = new Area(e.x-vr, e.y-vr, 2*vr+1, 2*vr+1);
		var ent, viewable;
		for(var id in this.entities) {
			ent = this.entities[id];
			if(ent.owner != e.owner) { // if someone elses ent
				viewable = viewBox.collides(ent);
				if(ent.visibleTo[e.owner] && Object.keys(ent.visibleTo[e.owner]).length > 0) { // if owner could see before
					if(!ent.visibleTo[e.owner][e.id] && viewable) { // add this entity as being seen
						ent.setVisibleTo(e.owner, e.id);
					} else if(ent.visibleTo[e.owner][e.id] && !viewable) { // remove as being seen by e
						ent.setInvisibleTo(e.owner, e.id);
						if(Object.keys(ent.visibleTo[e.owner]).length == 0) { // despawn if last seeing entity
							this.players[e.owner].socket.emit(Types.Messages.DESPAWN, id);
						}
					}
				} else if(viewable) { // if couldn't see but can now
					ent.setVisibleTo(e.owner, e.id);
					this.players[e.owner].socket.emit(Types.Messages.SPAWN, ent.toSendable());
				}
			}
		}
	},
	move: function(id, x, y) {
		var e = this.getEntity(id);
		this.map.unregisterEntity(e);
		e.setPosition(x, y); // move to pos
		this.map.registerEntity(e);
		this.players[e.owner].createDirtyArea(e); // update owner sight block
		this.updateVisibleAndMove(e); // update who can see entity/send move signal

		return true;
	},
	pickup: function(entityId, itemId) {
		var entity = this.getEntity(entityId),
			item = this.getEntity(itemId);
		this.map.unregisterEntity(item);
		entity.setItem(item);
	},
	drop: function(entityId, itemId) {
		var entity = this.getEntity(entityId),
			item = this.getEntity(itemId);
		this.map.unregisterEntity(item);
		entity.setItem(item);
	},
	gather: function(entityId, x, y) {
		var entity = this.getEntity(entityId),
			entities = this.map.entityAt(x, y),
			gathered = false;

		if(entity.getItem() == null) {
			for(var id in entities) {
				if(id != entityId && Types.isItem(entities[id].type)) {
					gathered = true;

					

					break;
				}
			}
		}

		return gathered;
	},
	build: function(id, type, x, y) {
		var entity = this.getEntity(id),
			item = entity.getItem(),
			prop, ents;

		if(map.blocked(x, y, prop.getWidth(), prop.getHeight())) {
			ents = map.entityAt(x, y);
			for(var i in ents) {
				if(ents[i].type == type && !ents[i].built) {
					prop = ents[i];
					break;
				}
			}
			if(typeof prop === 'undefined') {
				return false;
			}
		} else if(EntityFactory[type]) {
			prop = EntityFactory[type](entity.owner, type, x, y);
		} else {
			return false;
		}

		if(item && item.type in prop.cost) {
			prop.build(item, item.quantity);
		}

		this.players[entity.owner].socket.emit(Types.Messages.BUILD, prop.toSendable());

		return true;
	},
	train: function(id, type, x, y) {

	}
});

module.exports = World;