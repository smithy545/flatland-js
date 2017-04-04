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
		PICKUP: 15,
		DROP: 16,
		UPDATETILE: 19,

		// WIP
		BUILD: 17,
		TRAIN: 18,

		// undefined
		GATHER: 8,
		ATTACK: 9,
		RESEARCH: 10,
		TRADE: 11,
		EAT: 12,
		DRINK: 13,
		MINE: 14,
		STATE: 20,
	},

	Entities: {
		// actors
		PERSON: 1,
		MONSTER: 2,

		// props
		TREE: 10,
		WALL: 11,

		// items
		FRUIT: 20,
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