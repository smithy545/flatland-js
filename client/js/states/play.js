define(["state", "uihandler"], function(State, UIHandler) {
	var Play = State.extend({
		init: function(game) {
			this._super(game);

			this.selected = [];

			// generate ui
			this.UIElements["main_panel"] = UIHandler.createRect(0, game.renderer.getHeight()-200, game.renderer.getWidth(), 200, "#ccc", "#000");

		},
		mousedown: function(mouse) {
			var camera = this.game.renderer.camera;
			if(mouse.button === 0) {
				this.UIElements["selection_rect"] = UIHandler.createRectOutline(
					mouse.x-mouse.x%TILESIZE-camera.getX()%TILESIZE,
					mouse.y-mouse.y%TILESIZE-camera.getY()%TILESIZE,
					0, 0, "#ccc");
			}
		},
		mouseup: function(mouse) {
			var camera = this.game.renderer.camera;
			if(mouse.button === 2) { // move units
				var target = {
						x: Math.floor((mouse.x+camera.getX())/TILESIZE),
						y: Math.floor((mouse.y+camera.getY())/TILESIZE)
				};
				this.selected.forEach((actor) => {
					actor.setTarget(target);
					target = Util.nextFreeTile(this.game.map.pathingGrid, target);
				});
			} else if(mouse.button === 0) { // select units
				var rect = this.UIElements["selection_rect"];
				var x, y, entity;

				// handle possible negative rect
				if(rect.getWidth() < 0) {
					x = rect.getX()+rect.getWidth();
					rect.setWidth(-rect.getWidth());
				} else {
					x = rect.getX();
				}
				if(rect.getHeight() < 0) {
					y = rect.getY()+rect.getHeight();
					rect.setHeight(-rect.getHeight());
				} else {
					y = rect.getY();
				}

				x = (x+camera.getX())/TILESIZE;
				y = (y+camera.getY())/TILESIZE;

				this.selected = []; // clear list
				for(var i = x; i < x+rect.getGridWidth(); i++) {
					for(var j = y; j < y+rect.getGridHeight(); j++) {
						entity = this.game.entityAt(i, j);
						if(entity) {
							if(entity instanceof Array) {
								// handle list
							} else if(entity.owner === this.game.id){
								this.selected.push(entity);
							}
						}
					}
				}
				delete this.UIElements["selection_rect"];
			}
		},
		mousemove: function(mouse) {
			if(this.UIElements["selection_rect"]) {
				var rect = this.UIElements["selection_rect"];
				rect.setWidth(mouse.x-rect.getX());
				rect.setHeight(mouse.y-rect.getY());
			}
		},
		update: function(time) {
			// move camera
			if(this.game.keys[40]) { // arrow down
				this.game.renderer.panDown();
			} if(this.game.keys[37]) { // arrow left
				this.game.renderer.panLeft();
			} if(this.game.keys[38]) { // arrow up
				this.game.renderer.panUp();
			} if(this.game.keys[39]) { // arrow right
				this.game.renderer.panRight();
			}

			this.game.forEachActor((actor) => {
				var action = actor.update(this.game.pathfinder);
				if(action) {
					this.game.client.emitList(action);
				}
			});
			this.game.forEachEntity((entity) => {
				if(entity.currentAnimation) {
					entity.currentAnimation.update(time);
				}
			});
		}
	});

	return Play;
});