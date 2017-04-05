var Types = require('../shared/constants');
var Entity = require('./entity');

var Person = Entity.extend({
	init: function(owner, type, x, y, width, height, passable, character) {
		this._super(owner, type, x, y, width, height, passable);

		/* This is an assortment of the persons character traits.
		 * These traits determine how successful they are at various
		 * in-game tasks. These tasks are yet to be determined.
		 */
		this.character = character || {
			intelligence: 0,
			strength: 0,
			luck: 0,
		};

	},
	toSendable: function() {
		var obj = this._super();

		obj['character'] = this.character;

		return obj;
	}
});

module.exports = Person;