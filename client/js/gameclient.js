define(["lib/socket.io", "entityfactory"], function(io, EntityFactory) {
	var GameClient = Class.extend({
		init: function(game) {
			this.game = game;
			var conn = this.connection = io();

			conn.on('disconnect', function() {
				$("#disconnectMessage").show();
			});

			conn.emit(Types.MESSAGES.HELLO, this.game.storage.id); // init handshake
			conn.on(Types.MESSAGES.WELCOME, function(player, map) { // complete handshake
				game.start(player, map);

				conn.on(Types.MESSAGES.SPAWN, function(e) { // spawn entity in vision
					game.receiveEntity(e);
				});
				conn.on(Types.MESSAGES.DESPAWN, function(id) { // remove entity from vision
					game.removeEntity(id);
				});
				conn.on(Types.MESSAGES.MOVE, function(id, x, y) {
					game.map.unregisterEntity(game.entities[id]);
					game.entities[id].setGridPosition(x, y);
					game.map.registerEntity(game.entities[id]);
				});
			});
			conn.on(Types.MESSAGES.ERROR, function(msg) { //handle error
				console.log("Error: " + msg);
			});
		},
		emit: function() {
			var args = Array.prototype.slice.call(arguments); // convert to array

			// first arg is message, rest params
			this.connection.emit.apply(this.connection, args);
		},
		emitList: function(l) {
			this.connection.emit.apply(this.connection, l);
		}
	});

	return GameClient;
});