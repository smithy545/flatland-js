Types = {
	MESSAGES: {
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
		DRINK: 13
	},
	VIEWDISTANCE: {
		Person: 10,
		Tree: 0
	},
	ACTORS: {
		Person: 1,
	},
	PROPS: {
		Tree: 1,
	},

	getKind: function(type) {
		if(Types.ACTORS[type]) {
			return "actor";
		} else if(Types.PROPS[type]) {
			return "prop";
		}
		return "none";
	}
};

TILESIZE = 10;

if(!(typeof module === 'undefined')) {
    module.exports = Types;
}