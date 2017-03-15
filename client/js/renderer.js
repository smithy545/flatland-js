define(["camera"], function(Camera) {
	var Renderer = Class.extend({
		init: function(game, canvas) {
			this.game = game;	// parent game

			// drawing context
            this.context = (canvas && canvas.getContext) ? canvas.getContext("2d") : null;
			this.canvas = canvas;	// drawing canvas

			this.resize();
			this.createCamera();
		},
		setScale: function(scale) {
			this.camera.setScale(scale);
		},
		getScale: function() {
			return this.camera.scale;
		},
		setCameraView: function() {
			var scale = this.camera.scale;
            this.context.translate(-this.camera.x * scale, -this.camera.y * scale);
            this.context.scale(scale, scale);
		},
		clearScreen: function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		},
		resize: function() {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
		},
		getWidth: function() {
			return this.canvas.width;
		},
		getHeight: function() {
			return this.canvas.height;
		},
		createCamera: function() {
			this.camera = new Camera(this);
		},
		renderFrame: function() {
			var ctx = this.context;

			this.clearScreen();

			if(!this.game.isPaused) { // draw game
	            ctx.save();

	            this.setCameraView(); // set translation and scaling
		        
	            this.game.state.forEachEntity(function(e) {
	            	if(e.isVisible && this.camera.canSee(e)) {
	            		//draw entity
	            	}
	            });

		        ctx.restore();
		    }

		    //draw ui

		},
	});

	return Renderer;
});