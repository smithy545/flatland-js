define(["lib/socket.io", "entityfactory"], function(io, EntityFactory) {
	var GameClient = Class.extend({
		init: function(game) {
			this.game = game;
			var conn = this.connection = io();

			conn.on('disconnect', function() {
				$("#disconnectMessage").show();
			});

			conn.emit(Types.Messages.HELLO, this.game.storage.id); // init handshake
			conn.on(Types.Messages.WELCOME, function(player, mapFile) { // complete handshake
				game.start(player, mapFile);

				conn.on(Types.Messages.SPAWN, function(e) { // spawn entity in vision
					game.receiveEntity(e);
				});
				conn.on(Types.Messages.DESPAWN, function(id) { // remove entity from vision
					if(game.hasEntity(id)) {
						game.removeEntity(id);
					}
				});
				conn.on(Types.Messages.MOVE, function(id, x, y) {
					game.map.unregisterEntity(game.entities[id]);
					game.entities[id].setGridPosition(x, y);
					game.map.registerEntity(game.entities[id]);
				});

				conn.on(Types.Messages.UPDATETILE, function(type, x, y) {
					game.map.updateTile(type, x, y);
				});

				conn.on(Types.Messages.STATE, function(id, state) {
					game.updateEntityState(id, state);
				});

				conn.on(Types.Messages.BUILD, function(prop) {
					console.log(prop);
				});
			});
			conn.on(Types.Messages.ERROR, function(msg) { //handle error
				console.error("Server Error: " + msg);
				var id, code = arguments[1];
				switch(code) {
					case Types.Messages.MOVE:
						id = arguments[2];
						game.getEntity(id).path = []; // start pathing over
						break;
				}
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