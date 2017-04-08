define(["actors/person", "actors/monster", "props/tree", "props/wall", "items/fruit"], function(Person, Monster, Tree, Wall, Fruit) {
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
	EntityFactory.wall = EntityFactory[Types.Entities.WALL] = function(e) {
		return new Wall(e.id, e.owner, e.x, e.y, e.remainingCost, e.built);
	};
	EntityFactory.fruit = EntityFactory[Types.Entities.FRUIT] = function(e) {
		return new Fruit(e.id, e.x, e.y);
	};
	EntityFactory.wood = EntityFactory[Types.Entities.WOOD] = function(e) {
		return new Wood(e.id, e.x, e.y);
	};

	return EntityFactory;
});