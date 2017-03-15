var path = require('path');
var express = require('express');
var http = require('http');
var handlebars  = require('express-handlebars');
var sanitizer = require('sanitizer');
var bodyParser = require("body-parser");
var app = express();

port = 80;

// view engine
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');

// static files
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'shared')));

// form input
app.use(bodyParser());

app.get('/', function(req, res) {
	res.render('index');
});

app.post('/', function(req, res) {
	if(req.body) {
		var id = null
		var sanUser = sanitizer.sanitize(req.body.name);
		var sanPass = sanitizer.sanitize(req.body.pass);
		if(sanUser.length > 0 && sanPass.length > 0
		&& sanUser.length <= 20 && sanPass.length <= 30) {
			if(req.body.passConfirm) {
				var sanPassConfirm = req.body.passConfirm;
				if(sanPassConfirm.length > 0 && sanPassConfirm.length <= 30) {
					if(sanPass !== sanPassConfirm) {
						res.render('index', {message: "Password and confirm password don't match."});
					} else {
						ws.newUser(sanUser, sanPass, function(id) {
							res.render('game', {'id': id});
						}, function() {
							res.render('index', {message: "Username taken"});
						});
					}
				} else {
					res.render('index', {message: "Invalid form fields"});
				}
			} else {
				ws.login(sanUser, sanPass, function(id) {
					res.render('game', {'id': id});
				}, function() {
					res.render('index', {message: "Invalid user/pass combo."});
				});
			}
		} else {
			res.render('index', {message: "Invalid form fields"});
		}
	} else {
		res.render('index', {message: "Invalid form fields"});
	}
});

app.server = http.createServer(app);
var ws = require('./world/ws');
ws.init(app.server);

app.server.listen(port, function () {
  console.log('Listening on port ' + port);
});