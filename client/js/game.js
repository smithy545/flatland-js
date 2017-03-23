define(["renderer", "states", "gameclient", "map", "storage", "actor", "prop", "entityfactory", "pathfinder"],
    function(Renderer, States, GameClient, Map, Storage, Actor, Prop, EntityFactory, Pathfinder) {
	var Game = Class.extend({
		init: function(canvas, screen) {
			this.started = false;	// has the game started
			this.isStopped = true;	// is the game stopped
			this.isPaused = false;	// is the game paused
			this.renderer = new Renderer(this, canvas, screen);	// renderer object
			this.state = null;		// current game state
            this.storage = new Storage(this);   // cookie storage system
            this.id = this.storage.id;
            this.client = new GameClient(this); // connection to server
            this.map = null         // map object
            this.pathfinder = null  // pathfinder object

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
                button: null    // button most recently pressed
			};

            // keyboard state
            this.keys = {};
		},
		start: function(player, mapFile) {
            this.storage.setName(player);

            var startInterval = setInterval(() => {
                if(this.renderer.isLoaded) {
                    console.info("Loading map via Ajax.");
                    this.map = new Map(mapFile);
                    var mapInterval = setInterval(() => {
                        if(this.map.isLoaded) {
                            this.pathfinder = new Pathfinder(this.map);

                            player.entities.forEach((e) => {
                                this.receiveEntity(e);
                            });

                			this.started = true;
                			this.isStopped = false;
                			this.state = States.play(this); // game state

                			this.tick();
                            clearInterval(mapInterval);
                        }
                    }, 100);
                    clearInterval(startInterval);
                }
            }, 100);
		},
        hasEntity: function(id) {
            return this.entities[id] != undefined;
        },
        receiveEntity: function(e) {
            var entity = EntityFactory[e.type](e);
            if(entity.type === 'sprite') {
                entity.setSprite(this.renderer.spriteset[entity.spriteName], (entity) => {
                    entity.setState(e.state);
                    this.addEntity(entity);
                });
            } else {
                entity.setState(e.state);
                this.addEntity(entity);
            }
        },
		setRenderer: function(renderer) {
			this.renderer = renderer;
		},
        tick: function() {
            this.currentTime = new Date().getTime();
            
            if(this.started) {
                //game logic
                this.state.update(this.currentTime);
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
        mousedown: function(button, x, y) {
        	this.setMousePosition(x, y);
        	this.mouse.pressed = true;
            this.mouse.button = button;

        	this.state.mousedown(this.mouse); // unnecessary but helpful
        },
        mouseup: function(button, x, y) {
        	this.setMousePosition(x, y);
        	this.mouse.pressed = false;
            this.mouse.button = button;

        	this.state.mouseup(this.mouse); // unnecessary but helpful
        },
        mousemove: function(x, y) {
            // only set current, not previous
            this.mouse.x = x;
            this.mouse.y = y;

            this.state.mousemove(this.mouse); // unnecessary but helpful
        },
        keyup: function(key) {
            this.keys[key] = false;
        },
        keydown: function(key) {
            this.keys[key] = true;
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
        },
        forEachUIElement: function(callback) {
            var elements = this.state.getUIElements();
            for(i in elements) {
                callback(elements[i]);
            }
        },
        entityAt: function(x, y) {
            return this.map.entityAt(x, y);
        }
	});

	return Game;
});