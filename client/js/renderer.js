define(["camera", "artist", "sprites", "sprite"], function(Camera, Artist, sprites, Sprite) {
	var Renderer = Class.extend({
		init: function(game, canvas, screen) {
			this.game = game;	// parent game

			this.isLoaded = false;

			// drawing context
            this.context = (canvas && canvas.getContext) ? canvas.getContext("2d") : null;
            this.screenContext = (screen && screen.getContext) ? screen.getContext("2d") : null;
			this.canvas = canvas;	// drawing canvas
			this.screen = screen;	// obscuring canvas

			//this.sprites = sprites; unnecessary for now
			this.spriteset = {};
			this.spritesLoaded = false;
			this.tileset = null;
			this.tilesetLoaded = false;
			this.loadTiles();
			this.loadSprites();

			this.resize();
			this.createCamera();
		},
		loadSprites: function() {
			var counter = Object.keys(sprites).length;
			for(var name in sprites) {
				this.spriteset[name] = new Sprite(sprites[name], (id) => {
					console.info("Sprite " + id + " loaded.");
					counter--;
					if(counter == 0) {
						this.spritesLoaded = true;
						if(this.tilesetLoaded) {
							this.isLoaded = true;
						}
					}
				});
			}
		},
		loadTiles: function() {
        	this.tileset = new Image();
        	this.tileset.src = "img/tileset.gif";

        	this.tileset.onload = () => {
        		this.tilesetLoaded = true;
        		if(this.spritesLoaded) {
        			this.isLoaded = true;
        		}
        	};
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
            this.screenContext.translate(-this.camera.x * scale, -this.camera.y * scale);
            this.screenContext.scale(scale, scale);
		},
		clearScreen: function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.screenContext.clearRect(0, 0, this.screen.width, this.screen.height);
		},
		obscureUnseen: function() {
			this.screenContext.globalAlpha = 0.1;
			this.screenContext.fillStyle = "#000";
			this.screenContext.fillRect(0, 0, this.screen.width, this.screen.height);
		},
		resize: function() {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			this.screen.width = this.canvas.width;
			this.screen.height = this.canvas.height;
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
			if(this.camera.getY() > 0) {
				this.camera.setY(this.camera.getY()-4);
			}
		},
		panDown: function() {
			if(this.camera.getY() < this.game.map.height*TILESIZE) {
				this.camera.setY(this.camera.getY()+4);
			}
		},
		panLeft: function() {
			if(this.camera.getX() > 0) {
				this.camera.setX(this.camera.getX()-4);
			}
		},
		panRight: function() {
			if(this.camera.getX() < this.game.map.width*TILESIZE) {
				this.camera.setX(this.camera.getX()+4);
			}
		},
		renderFrame: function() {
			var ctx = this.context;

			this.clearScreen();
			this.obscureUnseen();

			if(!this.game.isPaused) { // draw game
	            ctx.save();
	            this.screenContext.save();

		        for(var x = -this.camera.getX()%TILESIZE; x < this.getWidth(); x += TILESIZE) {
		        	for(var y = -this.camera.getY()%TILESIZE; y < this.getHeight(); y += TILESIZE) {
		        		Artist['tile'](ctx, this.tileset, this.game.map, this.game.map.getTileAt(
		        			Math.floor((x+this.camera.getX())/TILESIZE),
		        			Math.floor((y+this.camera.getY())/TILESIZE)),
		        		x, y);
		        	}
		        }

	            this.setCameraView(); // set translation and scaling
		        
		        // unshadow visible areas
	            this.game.forEachActor((e) => {
	            	var vr;
            		vr = e.viewRadius*TILESIZE;
            		this.screenContext.clearRect(e.getX()-vr, e.getY()-vr, 2*vr+1, 2*vr+1);
	            });
	            this.game.forEachProp((e) => {
	            	var vr;
            		vr = e.viewRadius*TILESIZE;
            		this.screenContext.clearRect(e.getX()-vr, e.getY()-vr, 2*vr+1, 2*vr+1);
	            });

	            // draw entities
	            this.game.forEachEntity((e) => {
	            	if(e.isVisible() && this.camera.canSee(e)) {
	            		if(Artist[e.type]) {
	            			Artist[e.type](ctx, e);
	            			if(e.isSelected()) {
	            				ctx.strokeStyle = "#ff0";
			            		ctx.strokeRect(e.getX(), e.getY(), e.getWidth(), e.getHeight());
	            			}
	            		} else {
		            		// no drawing function, just use square
		            		ctx.strokeRect(e.getX(), e.getY(), e.getWidth(), e.getHeight());
		            	}
	            	}
	            });

	            this.screenContext.restore();
		        ctx.restore();
		    }

		    //draw ui
		    this.game.forEachUIElement((e) => {
            	if(e.isVisible()) {
            		this.screenContext.clearRect(e.getX(), e.getY(), e.getWidth(), e.getHeight());
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