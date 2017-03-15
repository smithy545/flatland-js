define(["lib/socket.io", "../../constants"], function(io) {
	var GameClient = Class.extend({
		init: function(game) {
			this.game = game;
			var conn = this.connection = io();

			conn.emit(Types.MESSAGES.HELLO, this.game.storage.id);
			conn.on(Types.MESSAGES.WELCOME, function() {
				// do stuff
			});
		}
	});

	return GameClient;
});