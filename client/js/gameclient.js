define(["lib/socket.io", "entityfactory"], function(io, EntityFactory) {
	var GameClient = Class.extend({
		init: function(game) {
			this.game = game;
			var conn = this.connection = io();

			conn.on('disconnect', function() {
				$("#disconnectMessage").show();
			});

			conn.emit(Types.MESSAGES.HELLO, this.game.storage.id); // init handshake
			conn.on(Types.MESSAGES.WELCOME, function(player) { // complete handshake
				game.start(player);
			});
			conn.on(Types.MESSAGES.ERROR, function(msg) { //handle error
				console.log("Error: " + msg);
			});
			conn.on(Types.MESSAGES.SPAWN, function(entity) { // spawn entity in vision
				game.addEntity(EntityFactory[entity.type](entity));
			});
			conn.on(Types.MESSAGES.DESPAWN, function(id) { // remove entity from vision
				game.removeEntity(id);
			});
			conn.on(Types.MESSAGES.MOVE, function(id, x, y) {
				game.entities[id].setGridPosition(x, y);
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