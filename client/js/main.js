requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'lib/jquery.min'
    }
});

define(["jquery", "../class", "game", "../util", "../constants"], function($, Class, Game) {

	var canvas = document.getElementById("game");
	var game = new Game(canvas);

	$(window).resize(function() {
		game.renderer.resize();
	});

	$(document).mousedown(function(evt) {
		if(game.started) {
			game.mousedown(evt.clientX, evt.clientY);
		}
	});

	$(document).mouseup(function(evt) {
		if(game.started) {
			game.mouseup(evt.clientX, evt.clientY);
		}
	});
});