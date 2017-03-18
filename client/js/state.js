define([], function() {
	var State = Class.extend({
		init: function(game) {
			this.game = game;
			this.UIElements = {};
		},
		mousedown: function(mouse) {
			// override
		},
		mouseup: function(mouse) {
			// override
		},
		mousemove: function(mouse) {
			// override
		},
		update: function() {
			// override
		},
		getUIElements: function() {
			return this.UIElements;
		}
	});

	return State;
});