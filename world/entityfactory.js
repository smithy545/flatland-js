var Entity = require('./entity');

var EntityFactory = {
	Person: function(owner, x, y) {
		return new Entity(owner, "Person", x, y, 1, 1);
	},
	Monster: function(x, y) {
		return new Entity(-1, "Monster", x, y, 1, 1);
	}
};

module.exports = EntityFactory;