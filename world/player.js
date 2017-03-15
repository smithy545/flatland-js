var Class = require('../shared/class');

var Player = Class.extend({
	init: function(name, id) {
		this.name = name;
		this.id = id;
	}
});

module.exports = Player;