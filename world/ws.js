var sqlite3 = require('sqlite3');

var World = require('./world');
var Types = require('../shared/constants');
var Class = require('../shared/class');

var db = new sqlite3.Database('db.sqlite3');

// basic hash code for now
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

var ws = {
	init: function(server) {
		var io = require('socket.io')(server);

		console.log("Creating world..");
		world = new World("world1");
		console.log("World created.");

		io.on('connection', function(socket) {
			console.log("Connection from " + socket.client.conn.remoteAddress);

			socket.on(Types.Messages.HELLO, function(id) {
				// TODO: sanitize to prevent sql injection
				db.get("SELECT name FROM user WHERE id="+id, function(err, row) {
					if(err) {
						return socket.emit(Types.Messages.ERROR, "Could not find user.");
					}
					socket.player = world.welcomePlayer(row.name, parseInt(id), socket);
					socket.player.socket = socket;
					var sendable = socket.player.toSendable();
					sendable.entities = [];
					for(var i in world.entities) {
						if(socket.player.canSee(world.entities[i])) {
							sendable.entities.push(world.entities[i]);
						}
					}
					socket.emit(Types.Messages.WELCOME, sendable, world.name + ".json");
				});
			});

			socket.on(Types.Messages.MOVE, function(id, x, y) {
				if(socket.player && world.canOrder(socket.player.id, id) && world.canMove(id, x, y)) {
					world.move(id, x, y);
				} else {
					socket.emit(Types.Messages.ERROR, "Cannot move entity there.", Types.Messages.MOVE, id);
				}
			});

			socket.on(Types.Messages.GATHER, function(id, x, y) {
				if(!(socket.player && world.canOrder(socket.player.id, id)
				&& Types.getKind(world.getEntity(id).type) == 'actor'
				&& world.gather(id, x, y))) {
					socket.emit(Types.Messages.ERROR, "Cannot gather there.", Type.Messages.GATHER);
				}
			});

			socket.on(Types.Messages.PICKUP, function(id, pickupId) {
				if(socket.player && world.canOrder(socket.player.id, id) && world.sameTile(id, pickupId)
				&& Types.isItem(world.getEntity(pickupId).type)
				&& Types.getKind(world.getEntity(id).type) == 'actor') {
					world.pickup(id, pickupId);
				} else {
					socket.emit(Types.Messages.ERROR, "Cannot pick that up.", Types.Messages.PICKUP);
				}
			});

			socket.on(Types.Messages.DROP, function(id, dropId) {
				if(socket.player && world.canOrder(socket.player.id, id)
				&& Types.getKind(world.getEntity(id).type) == 'actor'
				&& world.getEntity(id).item != null) {
					world.drop(id, dropId);
				} else {
					socket.emit(Types.Messages.ERROR, "Cannot drop that.", Types.Messages.DROP);
				}
			});

			socket.on(Types.Messages.MINE, function(id, x, y) {

			});

			socket.on(Types.Messages.ATTACK, function(id, x, y) {

			});

			socket.on(Types.Messages.BUILD, function(id, type, x, y) {
				if(socket.player && world.canOrder(socket.player.id, id)
				&& Types.getKind(world.getEntity(id).type) == 'prop'
				&& Types.getKind(type) == 'actor') {
					world.build(id, buildId, x, y);
				} else {
					socket.emit(Types.Messages.ERROR, "Cannot build that.", Types.Messages.BUILD);
				}
			});

			socket.on(Types.Messages.TRAIN, function(id, type, x, y) {

			});

			socket.on(Types.Messages.EAT, function(id, x, y) {

			});

			socket.on(Types.Messages.DRINK, function(id, x, y) {

			});

			socket.on('disconnect', function() {
				console.log(socket.client.conn.remoteAddress + " disconnected.");
			});

			socket.on('error', function() {
				console.log("Error: " + arguments);
			});
		});
	},
	login: function(user, pass, success, fail) {
		var passHash = pass.hashCode().toString();

		db.get("SELECT id FROM user WHERE name='"+user+"' AND pass='"+passHash+"'", function(err, row) {
			if(err) return fail();
			if(row != undefined) return success(row.id);
			
			fail();
		});
	},
	newUser: function(user, pass, success, fail) {
		var passHash = pass.hashCode().toString();

		db.get("SELECT id FROM user WHERE name='"+user+"' AND pass='"+passHash+"'", function(err, row) {
			if(err) return fail();
			if(row != undefined) return fail();

			db.run("INSERT INTO user (name, pass) VALUES ('"+user+"','"+passHash+"')", function(err) {
				if(err) return fail();
				db.get("SELECT id FROM user WHERE name='"+user+"' AND pass='"+passHash+"'", function(err, row) {
					if(err) return fail();
					if(row != undefined) return success(row.id);
					
					fail();
				});
			});
		});
	}
};


module.exports = ws;
