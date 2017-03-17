define([], function() {
	var Play = Class.extend({
		init: function(game) {
			this.game = game;
		},
		mousedown: function() {
		},
		mouseup: function() {
		},
		update: function() {
			this.game.forEachActor((actor) => {
				var action = actor.update();
				if(action) {
					this.game.client.emitList(action);
				}
			});
		},
	});

	return Play;
});