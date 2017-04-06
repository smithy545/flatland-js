var Types = require('../shared/constants');
var Entity = require('./entity');

var Prop = Entity.extend({
	init: function(owner, type, x, y, width, height, passable) {
		this._super(owner, type, x, y, width, height, passable);

		this.remainingCost = Types.getCost(this.type);
		this.built = false;
	},
	build: function(resource, quantity) {
		if(quantity >= this.remainingCost[resource]) {
			this.remainingCost[resource] = 0;
		} else {
			this.remainingCost[resource] -= quantity;
		}
		return this.ready();
	},
	ready: function() {
		for(var i  in this.remainingCost) {
			if(this.remainingCost[i] != 0) {
				return false;
			}
		}
		this.built = true;
		return true;
	},
	toSendable: function() {
		var obj = this._super();

		obj['remainingCost'] = this.remainingCost;

		return obj;
	}
});

module.exports = Prop;