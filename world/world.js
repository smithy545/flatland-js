var Class = require('../shared/class.js');

var World = Class.extend({
	init: function() {
		this.connections = {};
		this.players = {};
	},
	addConnection: function(socket) {
		this.connections[socket.id] = socket;
	},
});

module.exports = World;