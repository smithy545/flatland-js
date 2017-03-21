define(["actors/person", "actors/monster", "props/tree"], function(Person, Monster, Tree) {
	var EntityFactory = {
		Person: function(e) {
			return new Person(e.id, e.owner, e.character, e.x, e.y);
		},
		Monster: function(e) {
			return new Monster(e.id, e.x, e.y);
		},
		Tree: function(e) {
			return new Tree(e.id, e.x, e.y);
		}
	};

	return EntityFactory;
});