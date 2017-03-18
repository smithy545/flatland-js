define(["state", "uihandler"], function(State, UIHandler) {
	var Play = State.extend({
		init: function(game) {
			this._super(game);

			this.selected = [];
		},
		mousedown: function(mouse) {
			if(mouse.button === 0) {
				this.UIElements["selectionRect"] = UIHandler.createRectOutline(mouse.x-mouse.x%TILESIZE, mouse.y-mouse.y%TILESIZE, 0, 0);
			}
		},
		mouseup: function(mouse) {
			if(mouse.button === 2) { // move units
				this.selected.forEach((actor) => {
					actor.setTarget({
						x: Math.floor(mouse.x/TILESIZE),
						y: Math.floor(mouse.y/TILESIZE)
					});
				});
			} else if(mouse.button === 0) { // select units
				var rect = this.UIElements["selectionRect"];
				var x, y, entity;

				// handle possible negative rect
				if(rect.getWidth() < 0) {
					x = rect.getGridX()+rect.getGridWidth();
					rect.setWidth(-rect.getWidth());
				} else {
					x = rect.getGridX();
				}
				if(rect.getHeight() < 0) {
					y = rect.getGridY()+rect.getGridHeight();
					rect.setHeight(-rect.getHeight());
				} else {
					y = rect.getGridY();
				}

				this.selected = []; // clear list
				for(var i = x; i < x+rect.getGridWidth(); i++) {
					for(var j = y; j < y+rect.getGridHeight(); j++) {
						entity = this.game.entityAt(i, j);
						if(entity) {
							if(entity instanceof Array) {
								// handle list
							} else {
								this.selected.push(entity);
							}
						}
					}
				}
				delete this.UIElements["selectionRect"];
			}
		},
		mousemove: function(mouse) {
			if(this.UIElements["selectionRect"]) {
				var rect = this.UIElements["selectionRect"];
				rect.setWidth(mouse.x-rect.getX());
				rect.setHeight(mouse.y-rect.getY());
			}
		},
		update: function() {
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
		}
	});

	return Play;
});