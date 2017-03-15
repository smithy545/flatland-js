define(["lib/socket.io", "../../constants"], function(io) {
	var GameClient = Class.extend({
		init: function(game) {
			this.game = game;
			var conn = this.connection = io();

			conn.emit(Types.MESSAGES.HELLO, this.game.storage.id); // init handshake
			conn.on(Types.MESSAGES.WELCOME, function() { // complete handshake
				// do stuff
			});
		}
	});

	return GameClient;
});