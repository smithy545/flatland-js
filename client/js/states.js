define(["states/state"], function(State) {
	var States = {
		game: function(game) {
			return new State(game);
		}
	};

	return States;
});