var Entity = require('./entity');
var Types = require('../shared/constants');

var EntityFactory = {};

EntityFactory.person = EntityFactory[Types.Entities.PERSON] = function(owner, x, y) {
	return new Entity(owner, "person", x, y, 1, 1);
};

EntityFactory.monster = EntityFactory[Types.Entities.MONSTER] = function(x, y) {
	return new Entity(-1, "monster", x, y, 1, 1);
};

module.exports = EntityFactory;