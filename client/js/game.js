define(["renderer", "states", "gameclient", "map", "storage", "actor", "prop", "entityfactory"], function(Renderer, States, GameClient, Map, Storage, Actor, Prop, EntityFactory) {
	var Game = Class.extend({
		init: function(canvas) {
			this.started = false;	// has the game started
			this.isStopped = true;	// is the game stopped
			this.isPaused = false;	// is the game paused
			this.renderer = new Renderer(this, canvas);	// renderer object
			this.state = null;		// current game state
            this.storage = new Storage(this);   // cookie storage system
            this.id = this.storage.id;
            this.client = new GameClient(this); // connection to server
            this.map = null // map object

            // entity holders
            this.entities = {};
            this.actors = {};
            this.props = {};

            // visible areas
            this.areas = [];

			// mouse state
			this.mouse = {
				previousX: 0, // previous x-pos
				previousY: 0, // previous y-pos
				x: 0,	// current x-pos
				y: 0,	// current y-pos
				pressed: false, // whether or not mouse is held down
			};
		},
		start: function(player, map) {
            this.map = new Map(map.width, map.height);
            this.storage.setName(player);
            player.entities.forEach((e) => {
                this.addEntity(EntityFactory[e.type](e));
            });

			this.started = true;
			this.isStopped = false;
			this.state = States.play(this); // game state

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

            if(!this.isStopped) { // tick if not stopped
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
        },
        addEntity: function(e) {
            this.entities[e.id] = e;
            if(e instanceof Actor && e.owner == this.id) {
                this.actors[e.id] = true;
            }
            if(e instanceof Prop && e.owner == this.id) {
                this.props[e.id] = true;
            }
            this.map.registerEntity(e);
        },
        removeEntity: function(id) {
            this.map.unregisterEntity(this.entities[id]);
            delete this.entities[id];
            delete this.actors[id];
            delete this.props[id];
        },
        forEachEntity: function(callback) {
            for(i in this.entities) {
                callback(this.entities[i]);
            }
        },
        forEachActor: function(callback) {
            for(i in this.actors) {
                callback(this.entities[i]);
            }
        },
        forEachProp: function(callback) {
            for(i in this.props) {
                callback(this.entities[i]);
            }
        }
	});

	return Game;
});