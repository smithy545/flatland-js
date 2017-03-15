define(["renderer", "states", "gameclient", "storage"], function(Renderer, States, GameClient, Storage) {
	var Game = Class.extend({
		init: function(canvas) {
			this.started = false;	// has the game started
			this.isStopped = true;	// is the game stopped
			this.isPaused = false;	// is the game paused
			this.renderer = new Renderer(this, canvas);	// renderer object
			this.state = null;		// current game state
            this.storage = new Storage(this);   // cookie storage system
            this.client = new GameClient(this); // connection to server

			// mouse state
			this.mouse = {
				previousX: 0, // previous x-pos
				previousY: 0, // previous y-pos
				x: 0,	// current x-pos
				y: 0,	// current y-pos
				pressed: false,
			};
		},
		start: function() {
			this.started = true;
			this.isStopped = false;
			this.state = States.game(this); // game state

			this.tick();
		},
		setRenderer: function(renderer) {
			this.renderer = renderer;
		},
        tick: function() {
            this.currentTime = new Date().getTime();

            if(this.started) {
                //game logic
                this.state.update();
                this.renderer.renderFrame();
            }

            if(!this.isStopped) {
                requestAnimationFrame(this.tick.bind(this));
            }
        },
        setMousePosition(x, y) {
        	this.mouse.previousX = this.mouse.x;
        	this.mouse.previousY = this.mouse.y;
        	this.mouse.x = x;
        	this.mouse.y = y;
        },
        mousedown: function(x, y) {
        	this.setMousePosition(x, y);
        	this.mouse.pressed = true;

        	this.state.mousedown();
        },
        mouseup: function(x, y) {
        	this.setMousePosition(x, y);
        	this.mouse.pressed = false;

        	this.state.mouseup();
        },
        getMouseX: function() {
        	return this.mouse.x;
        },
        getMouseY: function() {
        	return this.mouse.y;
        }
	});

	return Game;
});