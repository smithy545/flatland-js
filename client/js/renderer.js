define(["camera", "artist"], function(Camera, Artist) {
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
			this.context.fillStyle = "#000";
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
		panUp: function() {
			this.camera.setY(this.camera.getY()-1);
		},
		panDown: function() {
			this.camera.setY(this.camera.getY()+1);
		},
		panLeft: function() {
			this.camera.setX(this.camera.getX()-1);
		},
		panRight: function() {
			this.camera.setX(this.camera.getX()+1);
		},
		renderFrame: function() {
			var ctx = this.context;

			this.clearScreen();

			if(!this.game.isPaused) { // draw game
	            ctx.save();

	            this.setCameraView(); // set translation and scaling
		        
		        // draw viewable tiles (only actors and props so unowned entities not included)
		        // TODO: look into ways to reduce redundant rect drawing (dirty rects?)
		        ctx.fillStyle = "#fff";
	            this.game.forEachActor((e) => {
	            	var vr;
            		vr = e.viewRadius*TILESIZE;
            		ctx.fillRect(e.getX()-vr, e.getY()-vr, 2*vr+1, 2*vr+1);
	            });
	            this.game.forEachProp((e) => {
	            	var vr;
            		vr = e.viewRadius*TILESIZE;
            		ctx.fillRect(e.getX()-vr, e.getY()-vr, 2*vr+1, 2*vr+1);
	            });

	            this.game.forEachEntity((e) => {
	            	if(e.isVisible() && this.camera.canSee(e)) {
	            		if(Artist[e.type]) {
	            			Artist[e.type](ctx, e);
	            		} else {
		            		// no drawing function, just use square
		            		ctx.strokeRect(e.getX(), e.getY(), e.getWidth(), e.getHeight());
		            	}
	            	}
	            });

		        ctx.restore();
		    }

		    //draw ui
		    this.game.forEachUIElement((e) => {
            	if(e.isVisible() && this.camera.canSee(e)) {
            		if(Artist[e.type]) {
            			Artist[e.type](ctx, e);
            		} else {
	            		// no drawing function, just use square
	            		ctx.strokeRect(e.getX(), e.getY(), e.getWidth(), e.getHeight());
	            	}
            	}
		    });
		},
	});

	return Renderer;
});