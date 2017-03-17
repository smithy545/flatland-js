var Class = require('../shared/class');
var Types = require('../shared/constants');
var Player = require('./player');
var Entity = require('./entity');
var Map = require('./map');
var Area = require('./area');

var World = Class.extend({
	init: function() {
		this.players = {};
		this.entities = {};
		this.entityId = 1;
		this.map = new Map(5000, 5000);
	},
	welcomePlayer: function(name, id, socket) {
		id = parseInt(id);
		if(!this.players[id]) {
			this.players[id] = new Player(name, id, socket);
			this.addEntity(new Entity(id, "Person", 10, 10, 1, 1)); // give commander
		}
		
		return this.players[id];
	},
	addEntity: function(e) {
		e.id = this.entityId++;
		this.entities[e.id] = e;
		this.players[e.owner].entities.push(e);
		this.players[e.owner].createDirtyAreas();
		this.map.registerEntity(e);
	},
	canOrder: function(ownerId, entityId) {
		return this.entities[entityId].owner == ownerId
	},
	canMove: function(id, x, y) {
		var e = this.entities[id];
		return Types.getKind(e.type) == "actor" && !this.map.blocked(x, y, e.width, e.height);
	},
	updateVisible: function(e) {
		// check if moved into sight of new player
		for(var id in this.players) {
			if(id !== e.owner) { // owner can always see
				if(this.players[id].canSee(e)) { // add to player view
					if(e.visibleTo[id]) { // if visible move
						this.players[id].socket.emit(Types.MESSAGES.MOVE, e.id, e.x, e.y);
					} else { // else spawn
						e.visibleTo[id] = true;
						this.players[id].socket.emit(Types.MESSAGES.SPAWN, e.toSendable());
					}
				} else { // remove from player view
					this.players[id].socket.emit(Types.MESSAGES.DESPAWN, e.id);
					delete e.visibleTo[id];
				}
			} else { // move if owned-may have to change later
				this.players[id].socket.emit(Types.MESSAGES.MOVE, e.id, e.x, e.y);
			}
		}
		// check if moved into sight of new entity
		var vr = Types.VIEWDISTANCE[e.type];
		var viewBox = new Area(e.x-vr, e.y-vr, 2*vr+1, 2*vr+1);
		for(var id in this.entities) {
			if(!this.entities[id].visibleTo[e.owner] && viewBox.collides(this.entities[id])) {
				this.entities[id].visibleTo[e.owner] = true;
				this.players[e.owner].socket.emit(Types.MESSAGES.SPAWN, this.entities[id].toSendable());
			}
		}
	},
	move: function(id, x, y) {
		var e = this.entities[id];
		this.map.unregisterEntity(e);
		e.setPosition(x, y); // move to pos
		this.map.registerEntity(e);
		this.players[e.owner].updateDirtyAreas(e); // update owner sight blocks
		this.updateVisible(e); // update who can see entity/send move signal
	}
});

module.exports = World;