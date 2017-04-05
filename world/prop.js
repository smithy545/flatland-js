var Types = require('../shared/constants');
var Entity = require('./entity');

var Prop = Entity.extend({
	init: function(owner, type, x, y, width, height, passable) {
		this._super(owner, type, x, y, width, height, passable);

		this.cost = Types.getCost(this.type);
		this.built = false;
	},
	build: function(resource, quantity) {
		if(quantity >= this.cost[resource]) {
			this.cost[resource] = 0;
		} else {
			this.cost[resource] -= quantity;
		}
		return this.ready();
	},
	ready: function() {
		for(var i  in this.cost) {
			if(this.cost[i] != 0) {
				return false;
			}
		}
		this.built = true;
		return true;
	},
	toSendable: function() {
		var obj = this._super();

		obj['cost'] = this.cost;

		return obj;
	}
});

module.exports = Prop;