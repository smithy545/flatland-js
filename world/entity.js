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

		if(this.type == "Person") {
			var charArray = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];
			/* This is a 6 digit assortment of the persons character traits.
			 * These traits determine how successful they are at various
			 * in-game tasks. These tasks are yet to be determined.
			 * They also determine their color. The traits are as follows:
			 * Charisma: How well the communicate/trade with others
			 * Dexterity: How good they are at dodging
			 * Intelligence: How well they research
			 * Strength: How good at fighting/farming they are
			 * Constitution: How much health they have/food they need
			 * Luck: Affects a little of everything
			 * Warning to future me: subject to change
			 */
			this.character = "#";
			for(var i = 0; i < 6; i++) {
				this.character += charArray[Math.floor(Math.random(Date.now())*16)];
			}
		}
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
		var obj = {
			x: this.x,
			y: this.y,
			h: this.h,
			w: this.w,
			owner: this.owner,
			type: this.type,
			id: this.id,
		};
		if(this.type == "Person") {
			obj['character'] = this.character;
		}

		return obj;
	}
});

module.exports = Entity;