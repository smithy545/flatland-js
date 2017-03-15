var Class = require('../shared/class.js');
var d

var World = Class.extend({
	init: function() {
		this.connections = {};
		this.players = {};
	},
	addConnection: function(socket) {
		this.connections[socket.id] = socket;
	},
	welcomePlayer: function(name, id) {
		if(!this.players[id]) {
			this.players[id] = new Player(name, id);
		}
		
		return this.players[id];
	}
});

module.exports = World;