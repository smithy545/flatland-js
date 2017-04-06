var Types = require('../shared/constants');
var Entity = require('./entity');

var Item = Entity.extend({
	init: function(type, x, y, width, height, passable, quantity) {
		this._super(-1, type, x, y, width, height, passable);

		this.quantity = quantity || 1;
	},
});

module.exports = Item;