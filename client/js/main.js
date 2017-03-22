requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'lib/jquery.min'
    }
});

define(["jquery", "lib/underscore.min", "../class", "game", "../util", "../constants"], function($, _, Class, Game) {

	var canvas = document.getElementById("game");
	var screen = document.getElementById("screen");
	var game = new Game(canvas, screen);

	$(window).resize(function() {
		game.renderer.resize();
	});

	$(document).mousedown(function(evt) {
		if(game.started) {
			game.mousedown(evt.button, evt.clientX, evt.clientY);
		}
	});

	$(document).mouseup(function(evt) {
		if(game.started) {
			game.mouseup(evt.button, evt.clientX, evt.clientY);
		}
	});

	$(document).mousemove(function(evt) {
		if(game.started) {
			game.mousemove(evt.clientX, evt.clientY);
		}
	});

	$(document).keyup(function(evt) {
		if(game.started) {
			game.keyup(evt.keyCode);
		}
	});

	$(document).keydown(function(evt) {
		if(game.started) {
			game.keydown(evt.keyCode);
		}
	});
});