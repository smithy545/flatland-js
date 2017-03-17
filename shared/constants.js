Types = {
	MESSAGES: {
		HELLO: 1,
		WELCOME: 2,
		ERROR: 3,
		SPAWN: 4,
		DESPAWN: 5,
		ENTITIES: 6,
		MOVE: 7
	}
}

TILESIZE = 10;

if(!(typeof module === 'undefined')) {
    module.exports = Types;
}