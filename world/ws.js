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
		world = new World();
		console.log("World created.");

		io.on('connection', function(socket) {
			console.log("Connection from " + socket.client.conn.remoteAddress);

			socket.on(Types.MESSAGES.HELLO, function(id) {
				db.get("SELECT name FROM user WHERE id="+id, function(err, row) {
					if(err) {
						return socket.emit(Types.MESSAGES.ERROR, "Could not find user.");
					}
					socket.player = world.welcomePlayer(row.name, parseInt(id), socket);
					socket.emit(Types.MESSAGES.WELCOME, socket.player.toSendable());
				});
			});
			socket.on(Types.MESSAGES.MOVE, function(id, x, y) {
				if(socket.player && world.canOrder(socket.player.id, id) && world.canMove(id, x, y)) {
					world.move(id, x, y);
				}
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
