var Class = require('../shared/class');
var Player = require('./player');
var Entity = require('./entity');
var Map = require('./map');

var World = Class.extend({
	init: function() {
		this.players = {};
		this.entities = {};
		this.entityId = 1;
		this.map = new Map();
	},
	welcomePlayer: function(name, id, socket) {
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
	},
	canMove: function(id, x, y) {
		return true;
	},
	updateVisible: function(e) {
		for(id in this.players) {
			if(parseInt(id) !== e.owner) { // owner can always see
				if(this.players[id].canSee(e)) { // add to player view
					if(e.visibleTo[id]) { // if visible move
						this.players[id].socket.emit(Types.MESSAGES.MOVE, e.id, e.x, e.y);
					} else { // else spawn
						e.visibleTo[id] = true;
						this.players[id].socket.emit(Types.MESSAGES.SPAWN, e);
					}
				} else { // remove from player view
					this.players[id].socket.emit(Types.MESSAGES.DESPAWN, e.id);
					delete e.visibleTo[id];
				}
			} else { // may have to change later
				this.players[id].socket.emit(Types.MESSAGES.MOVE, e.id, e.x, e.y);
			}
		}
	},
	move: function(id, x, y) {
		var e = this.entities[id];
		e.setPosition(x, y); // move to pos
		this.players[e.owner].updateDirtyAreas(); // update owner
		this.updateVisible(e); // update who can see entity/send move signal
	}
});

module.exports = World;