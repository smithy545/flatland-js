var Types = {
	Messages: {
		// defined
		HELLO: 1,
		WELCOME: 2,
		ERROR: 3,
		SPAWN: 4,
		DESPAWN: 5,
		ENTITIES: 6,
		MOVE: 7,

		// undefined
		GATHER: 8,
		ATTACK: 9,
		RESEARCH: 10,
		TRADE: 11,
		EAT: 12,
		DRINK: 13,
		MINE: 14,
		PICKUP: 15,
		DROP: 16,
		BUILD: 17,
		TRAIN: 18
	},

	Entities: {
		PERSON: 1,
		MONSTER: 2,
		TREE: 3,
		WALL: 4,
		FRUIT: 5,
	},
	Directions: {
		UP: 1,
		DOWN: 2,
		LEFT: 3,
		RIGHT: 4,
		UPLEFT: 5,
		UPRIGHT: 6,
		DOWNLEFT: 7,
		DOWNRIGHT: 8,
	},

	getKind: function(name) {
		return Kinds[name][0];
	},

	getKindAsString: function(name) {
		return Kinds[name][1];
	},

	getViewDistance: function(name) {
		return Kinds[name][2];
	},
};

Kinds = {
	person: [Types.Entities.PERSON, "actor", 10],
    monster: [Types.Entities.MONSTER, "actor", 3],
    tree: [Types.Entities.TREE, "prop", 0],
    wall: [Types.Entities.WALL, "prop", 1],
    fruit: [Types.Entities.FRUIT, "item", 0],
};

TILESIZE = 32;

if(!(typeof module === 'undefined')) {
    module.exports = Types;
}