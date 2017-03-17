var Class = require('../shared/class');

var Area = Class.extend({
	init: function(x, y, width, height) {
		// all in grid coords
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.children = []; // for dirty areas
	},
	contains: function(x, y) {
		return x > this.x && x < this.x + this.width
			&& y > this.y && y < this.y + this.height;
	},
	collides: function(r) {
		return r.getX() < this.x + this.width && r.getX() + r.getWidth() > this.x
			&& r.getY() < this.y + this.height && r.getY() + r.getHeight() > this.y;
	},
	surrounds: function(r) {
		return this.contains(r.getX(), r.getY())
			&& this.contains(r.getX()+r.getWidth(), r.getY())
			&& this.contains(r.getX(), r.getY()+r.getHeight())
			&& this.contains(r.getX()+r.getWidth(), r.getY()+r.getHeight());
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
	toSendable: function() {
		return {
			x: this.getX(),
			y: this.getY(),
			width: this.getWidth(),
			height: this.getHeight()
		};
	},
	addChild: function(a) {
		this.children.push(a);
	}
});

module.exports = Area;