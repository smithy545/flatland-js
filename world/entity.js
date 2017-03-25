var Class = require('../shared/class');

var Entity = Class.extend({
	init: function(owner, type, x, y, width, height, passable) {
		// all in grid coords
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.id = null;
		this.owner = owner;
		this.type = type;
		this.visibleTo = {}; // set after id is defined
		this.state = "idle_down";
		this.item = null;
		this.passable = passable || false;

		if(this.type == "Person") {
			/* This is an assortment of the persons character traits.
			 * These traits determine how successful they are at various
			 * in-game tasks. These tasks are yet to be determined.
			 */
			this.character = {
				intelligence: 0,
				strength: 0,
				luck: 0,
			};
		}
	},
	setVisibleTo: function(ownerId, entityId) {
		if(!this.visibleTo[ownerId]) {
			this.visibleTo[ownerId] = {};
		}
		this.visibleTo[ownerId][entityId] = true;
	},
	setInvisibleTo: function(ownerId, entityId) {
		delete this.visibleTo[ownerId][entityId];
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
	getItem: function() {
		return this.item;
	},
	setItem: function(item) {
		this.item = item;
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
	setPassable: function(val) {
		if(typeof val !== 'undefined') {
			this.passable = val;
		} else {
			this.passable = true;
		}
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
			state: this.state
		};
		if(this.type == "Person") {
			obj['character'] = this.character;
		}

		return obj;
	}
});

module.exports = Entity;