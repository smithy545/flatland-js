var sqlite3 = require('sqlite3');

var World = require('./world');
var Types = require('../shared/constants');

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
			world.addConnection(socket);

			socket.on(Types.MESSAGES.HELLO, function(name, pass) {

			});
		});
	},
	login: function(user, pass, success, fail) {
		var passHash = pass.hashCode().toString();
		var db = new sqlite3.Database('db.sqlite3');

		db.get("SELECT id FROM user WHERE name='"+user+"' AND pass='"+passHash+"'", function(err, id) {
			if(err) return fail();
			if(id != undefined) return success(id);
			
			fail();
		});
		db.close();
	},
	newUser: function(user, pass, success, fail) {
		var passHash = pass.hashCode().toString();
		var db = new sqlite3.Database('db.sqlite3');

		db.get("SELECT id FROM user WHERE name='"+user+"' AND pass='"+passHash+"'", function(err, id) {
			if(err) return fail();
			if(id != undefined) return fail();

			db.run("INSERT INTO user (name, pass) VALUES ('"+user+"','"+passHash+"')", function(err) {
				if(err) return fail();
				db.get("SELECT id FROM user WHERE name='"+user+"' AND pass='"+passHash+"'", function(err, id) {
					if(err) return fail();
					if(id != undefined) return success(id);
					
					fail();
				});
			});
		});

		db.close();
	}
};


module.exports = ws;
