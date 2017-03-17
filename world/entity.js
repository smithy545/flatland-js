var Class = require('../shared/class');

var Entity = Class.extend({
	init: function(owner, type, x, y, width, height) {
		// all in grid coords
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.id = null;
		this.owner = owner;
		this.type = type;
		this.visibleTo = {};
		this.visibleTo[owner] = true;
	},
	getX: function() {
		return this.x;
	},
	getY: function() {
		return this.y;
	},
	getWidth: function() {
		return this.width;
	},
	getHeight: function() {
		return this.height;
	},
	setX: function(x) {
		this.x = x;
	},
	setY: function(y) {
		this.y = y;
	},
	setPosition: function(x, y) {
		this.x = x;
		this.y = y;
	},
	toSendable: function() {
		return {
			x: this.x,
			y: this.y,
			h: this.h,
			w: this.w,
			owner: this.owner,
			type: this.type,
			id: this.id
		};
	}
});

module.exports = Entity;