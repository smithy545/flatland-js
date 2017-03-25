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
		var mapFile = "world1.json";

		console.log("Creating world..");
		world = new World(mapFile);
		console.log("World created.");

		io.on('connection', function(socket) {
			console.log("Connection from " + socket.client.conn.remoteAddress);

			socket.on(Types.MESSAGES.HELLO, function(id) {
				db.get("SELECT name FROM user WHERE id="+id, function(err, row) {
					if(err) {
						return socket.emit(Types.MESSAGES.ERROR, "Could not find user.");
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
					socket.emit(Types.MESSAGES.WELCOME, sendable, mapFile);
				});
			});

			socket.on(Types.MESSAGES.MOVE, function(id, x, y) {
				if(socket.player && world.canOrder(socket.player.id, id) && world.canMove(id, x, y)) {
					world.move(id, x, y);
				} else {
					socket.emit(Types.MESSAGES.ERROR, "Cannot move entity there.", Types.MESSAGES.MOVE, id);
				}
			});

			socket.on(Types.MESSAGES.GATHER, function(id, x, y) {

			});

			socket.on(Types.MESSAGES.PICKUP, function(id, pickupId) {
				if(socket.player && world.canOrder(socket.player.id, id) && world.sameTile(id, pickupId)
				&& Types.getKind(world.getEntity(pickupId).type) == 'item'
				&& Types.getKind(world.getEntity(id).type) == 'actor') {
					world.pickup(id, pickupId);
				} else {
					socket.emit(Types.MESSAGES.ERROR, "Cannot pickup that.", Types.MESSAGES.PICKUP);
				}
			});

			socket.on(Types.MESSAGES.DROP, function(id, dropId) {
				if(socket.player && world.canOrder(socket.player.id, id)
				&& Types.getKind(world.getEntity(id).type) == 'actor'
				&& world.getEntity(id).item != null) {
					world.drop(id, dropId);
				} else {
					socket.emit(Types.MESSAGES.ERROR, "Cannot pickup that.", Types.MESSAGES.PICKUP);
				}
			});

			socket.on(Types.MESSAGES.MINE, function(id, x, y) {

			});

			socket.on(Types.MESSAGES.ATTACK, function(id, x, y) {

			});

			socket.on(Types.MESSAGES.BUILD, function(id, building, x, y) {

			});

			socket.on(Types.MESSAGES.EAT, function(id, x, y) {

			});

			socket.on(Types.MESSAGES.DRINK, function(id, x, y) {

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
