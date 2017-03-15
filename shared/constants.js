Types = {
	MESSAGES: {
		HELLO: 1,
		WELCOME: 2,
		ERROR: 3,
	}
}

if(!(typeof module === 'undefined')) {
    module.exports = Types;
}