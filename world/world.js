var Class = require('../shared/class');
var Types = require('../shared/constants');
var Player = require('./player');
var Entity = require('./entity');
var EntityFactory = require('./entityfactory');
var Map = require('./map');
var Area = require('./area');

var World = Class.extend({
	init: function() {
		this.players = {};
		this.entities = {};
		this.entityId = 1;
		this.map = new Map("../shared/map.json");

		this.addEntity(EntityFactory["Monster"](5, 5));
	},
	welcomePlayer: function(name, id, socket) {
		id = parseInt(id);
		if(!this.players[id]) {
			this.players[id] = new Player(name, id, socket);
			for(var i = 0; i < 5; i++) {
				this.addEntity(EntityFactory["Person"](id, 10+i, 10)); // give commander
			}
		}
		
		return this.players[id];
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
	canOrder: function(ownerId, entityId) {
		return this.entities[entityId].owner == ownerId
	},
	canMove: function(id, x, y) {
		var e = this.entities[id];
		return Types.getKind(e.type) == "actor"
			&& !this.map.blocked(x, y, e.getWidth(), e.getHeight())
			&& this.map.isNextTo(e, x, y);
	},
	updateVisible: function(e) {
		// for new entity
		var visibleTo, couldSee;
		// check if players can see entity
		for(var id in this.players) {
			if(parseInt(id) !== e.owner) { // owner can always see
				visibleTo = this.players[id].whoCanSee(e);
				couldSee = Object.keys(e.visibleTo[id]).length > 0;
				if(visibleTo.length > 0) { // if visible
					e.visibleTo[id] = {};
					for(var i = 0; i < visibleTo.length; i++) {
						e.setVisibleTo(id, visibleTo[i]);
					}
					if(!couldSee) { // if new entity
						this.players[id].socket.emit(Types.MESSAGES.SPAWN, e.toSendable());
					}
				} else if(couldSee) { // if removing entity
					this.players[id].socket.emit(Types.MESSAGES.DESPAWN, e.id);
				}
			}
		}

		// check if owner can see new entities
		var vr = Types.VIEWDISTANCE[e.type];
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
							this.players[e.owner].socket.emit(Types.MESSAGES.DESPAWN, id);
						}
					}
				} else if(viewable) { // if couldn't see but can now
					ent.setVisibleTo(e.owner, e.id);
					this.players[e.owner].socket.emit(Types.MESSAGES.SPAWN, ent.toSendable());
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
						this.players[id].socket.emit(Types.MESSAGES.MOVE, e.id, e.x, e.y);
					} else { // else spawn
						this.players[id].socket.emit(Types.MESSAGES.SPAWN, e.toSendable());
					}
				} else if(couldSee) { // remove from player view
					e.visibleTo[id] = {};
					this.players[id].socket.emit(Types.MESSAGES.DESPAWN, e.id);
				}
			} else { // move if owned
				this.players[id].socket.emit(Types.MESSAGES.MOVE, e.id, e.x, e.y);
			}
		}
		// check if moved into/out of sight of new entity
		var vr = Types.VIEWDISTANCE[e.type];
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
							this.players[e.owner].socket.emit(Types.MESSAGES.DESPAWN, id);
						}
					}
				} else if(viewable) { // if couldn't see but can now
					ent.setVisibleTo(e.owner, e.id);
					this.players[e.owner].socket.emit(Types.MESSAGES.SPAWN, ent.toSendable());
				}
			}
		}
	},
	move: function(id, x, y) {
		var e = this.entities[id];
		this.map.unregisterEntity(e);
		e.setPosition(x, y); // move to pos
		this.map.registerEntity(e);
		this.players[e.owner].createDirtyArea(e); // update owner sight block
		this.updateVisibleAndMove(e); // update who can see entity/send move signal
	}
});

module.exports = World;