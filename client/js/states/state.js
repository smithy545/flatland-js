define([], function() {
	var State = Class.extend({
		init: function(game) {
			this.game = game;
		},
		mousedown: function() {
			// pls override
		},
		mouseup: function() {
			// this one too
		},
		update: function() {
			// and this one
		}
	});

	return State;
});