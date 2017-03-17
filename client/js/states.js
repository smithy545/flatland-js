define(["states/play"], function(Play) {
	var States = {
		play: function(game) {
			return new Play(game);
		}
	};

	return States;
});