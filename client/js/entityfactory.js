define(["actors/person", "actors/monster", "props/tree"], function(Person, Monster, Tree) {
	var EntityFactory = {};

	EntityFactory.person = EntityFactory[Types.Entities.PERSON] = function(e) {
		return new Person(e.id, e.owner, e.character, e.x, e.y);
	};
	EntityFactory.monster = EntityFactory[Types.Entities.MONSTER] = function(e) {
		return new Monster(e.id, e.x, e.y);
	};
	EntityFactory.tree = EntityFactory[Types.Entities.TREE] = function(e) {
		return new Tree(e.id, e.x, e.y);
	};

	return EntityFactory;
});