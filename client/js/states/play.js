define(["state", "uihandler", "actor"], function(State, UIHandler, Actor) {
	var Play = State.extend({
		init: function(game) {
			this._super(game);

			this.selected = null;

			// generate ui
			var mouse = game.mouse,
				camera = game.renderer.camera;

			var width = game.renderer.getWidth(), height = game.renderer.getHeight(),
				ui_height = 3*TILESIZE;
			var ui_elements = this.UIElements, self = this;
			this.UIElements["selection_rect"] = UIHandler.createRectOutline(
				mouse.x-mouse.x%TILESIZE-camera.getX()%TILESIZE,
				mouse.y-mouse.y%TILESIZE-camera.getY()%TILESIZE,
				TILESIZE, TILESIZE, "#ccc");

			var buttonHeight = TILESIZE, buttonWidth = 4*TILESIZE, buttonFontSize = 24;
			var buttonNames = ["Structures", "1", "2", "3", "4", "5"], name;
			var buttonCallbacks = {
				"Structures": this.structureButton,
				"1": null,
				"2": null,
				"3": null,
				"4": null,
				"5": null
			};
			for(var i = 0; i < 6; i++) {
				name = buttonNames[i];
				var press_callback = function() {
					if(ui_elements[this.text+"_button_active"]) {	// remove
						delete ui_elements[this.text+"_button_active"];
						this.setVisible();

						if(buttonCallbacks[this.text]) {
							buttonCallbacks[this.text](false, this);
						}
					} else {										// press
						this.setInvisible();
						ui_elements[this.text+"_button_active"] = UIHandler.createTextRect(this.getX(), this.getY(), buttonWidth, buttonHeight, this.text, buttonFontSize, null, "#000", "#fff", "#fff");

						for(var j in buttonCallbacks) {
							if(j == this.text) {	// pressed if this button
								if(buttonCallbacks[j]) {
									buttonCallbacks[j](true, this);
								}
							} else {				// removed if other button
								delete ui_elements[j+"_button_active"];
								ui_elements[j+"_button"].setVisible();

								if(buttonCallbacks[j]) {
									buttonCallbacks[j](false, ui_elements[j+"_button"]);
								}
							}
						}
					}
				};
				ui_elements[name+"_button"] = UIHandler.createTextRect(buttonWidth*Math.floor(i/3), (i%3)*buttonHeight+height-ui_height, buttonWidth, buttonHeight,
					name, buttonFontSize, null, "#888", "#000", "#000");
				ui_elements[name+"_button"].onTrigger(press_callback.bind(ui_elements[name+"_button"]));
			}

			this.UIElements["entity_view"] = UIHandler.createRect(width-ui_height,
				height-ui_height,
				ui_height, ui_height, "#888", "#000");
			this.UIElements["entity_watcher"] = UIHandler.createRect(0, 0, width, height, "#fff", "#fff", 
				null, null, function() {
					var fontSize = 12;
					if(self.selected) {
						ui_elements["entity_type"] = UIHandler.createText(width-ui_height+5, height-ui_height+fontSize,
							"type = " + self.selected.type, fontSize);
						ui_elements["entity_x"] = UIHandler.createText(width-ui_height+5, height-ui_height+fontSize*2,
							"x = " + self.selected.gridX, fontSize);
						ui_elements["entity_y"] = UIHandler.createText(width-ui_height+5, height-ui_height+fontSize*3,
							"y = " + self.selected.gridY, fontSize);

					} else {
						ui_elements["entity_type"] = UIHandler.createText(width-ui_height+5, height-ui_height+fontSize,
							"type = ", fontSize);
						ui_elements["entity_x"] = UIHandler.createText(width-ui_height+5, height-ui_height+fontSize*2,
							"x = ", fontSize);
						ui_elements["entity_y"] = UIHandler.createText(width-ui_height+5, height-ui_height+fontSize*3,
							"y = ", fontSize);
					}
				});
			this.UIElements["entity_watcher"].setInvisible();

		},
		structureButton: function(pressed, button) {
			if(pressed) {	// create

			} else {		// destroy

			}
		},
		mousedown: function(mouse) {
			var camera = this.game.renderer.camera,
				triggered = false,
				ui;
			if(mouse.button === 0) {
				for(var i in this.UIElements) {
					ui = this.UIElements[i];
					if(Util.contains(ui, mouse.x, mouse.y)) {
						triggered = ui.trigger() || triggered;
					}
				}

				if(!triggered) {
					// make rect yellow for highlighting
					this.UIElements["selection_rect"] = UIHandler.createRectOutline(
						mouse.x-(mouse.x+camera.getX())%TILESIZE,
						mouse.y-(mouse.y+camera.getY())%TILESIZE,
						TILESIZE, TILESIZE, "#0ff");
					/* remove multiple entity selection for now

					this.UIElements["selection_rect"] = UIHandler.createRectOutline(
						mouse.x-mouse.x%TILESIZE-camera.getX()%TILESIZE,
						mouse.y-mouse.y%TILESIZE-camera.getY()%TILESIZE,
						TILESIZE, TILESIZE, "#ccc");
					*/
				}					
			}
		},
		mouseup: function(mouse) {
			var camera = this.game.renderer.camera,
				triggered = false,
				entity,
				foundEntities,
				ui,
				x, y;
			if(mouse.button === 2) { // move units
				if(this.selected && this.selected.owner == this.game.id) {
					var target = {
						x: Math.floor((mouse.x+camera.getX())/TILESIZE),
						y: Math.floor((mouse.y+camera.getY())/TILESIZE)
					};
					if(target.x != this.selected.gridX || target.y != this.selected.gridY) {
						if(!this.game.map.blocked(target.x, target.y)) {
							this.selected.setTarget(target);
						} else {
							console.error("Cannot path there. Tile is taken.");
							this.selected.setTarget(Util.nextFreeTile(this.game.map.pathingGrid, target))
						}
					}
				}

				/* remove multiple entity selection for now

				var target = {
						x: Math.floor((mouse.x+camera.getX())/TILESIZE),
						y: Math.floor((mouse.y+camera.getY())/TILESIZE)
				};
				this.selected.forEach((actor) => {
					actor.setTarget(target);
					target = Util.nextFreeTile(this.game.map.pathingGrid, target);
				});
				*/
			} else if(mouse.button === 0) { // select units
				for(var i in this.UIElements) {
					ui = this.UIElements[i];
					if(Util.contains(ui, mouse.x, mouse.y)) {
						triggered = ui.untrigger() || triggered;
					}
				}

				if(!triggered) {
					x = Math.floor((mouse.x + camera.getX())/TILESIZE);
					y = Math.floor((mouse.y + camera.getY())/TILESIZE);

					entity = null;
					foundEntities = this.game.entityAt(x, y);
					for(var i in foundEntities) {
						if(foundEntities[i] instanceof Actor) {
							entity = foundEntities[i];
						} else if(entity == null) {
							entity = foundEntities[i];
						}
					}
					if(this.selected) {
						this.selected.setSelected(false);
					}
					if(entity) {
						this.selected = entity;
						entity.setSelected();
					} else {
						this.selected = null;
					}

					// make rect gray again
					this.UIElements["selection_rect"] = UIHandler.createRectOutline(
						mouse.x-mouse.x%TILESIZE-camera.getX()%TILESIZE,
						mouse.y-mouse.y%TILESIZE-camera.getY()%TILESIZE,
						TILESIZE, TILESIZE, "#ccc");				

					/* remove multiple entity selection for now

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
					*/
				}
			}
		},
		mousemove: function(mouse) {
			var camera = this.game.renderer.camera,
				rect = this.UIElements["selection_rect"],
				x = mouse.x-(camera.getX()+mouse.x)%TILESIZE,
				y = mouse.y-(camera.getY()+mouse.y)%TILESIZE;

			if(rect.getX() != x || rect.getY() != y) {
				if(mouse.pressed) {
					this.UIElements["selection_rect"] = UIHandler.createRectOutline(x, y, TILESIZE, TILESIZE, "#0ff");
				} else if(this.game.map.blocked(Math.floor(x/TILESIZE), Math.floor(y/TILESIZE)) && this.selected) {
					this.UIElements["selection_rect"] = UIHandler.createRectOutline(x, y, TILESIZE, TILESIZE, "#f00");
				} else {
					this.UIElements["selection_rect"] = UIHandler.createRectOutline(x, y, TILESIZE, TILESIZE, "#ccc");
				}
			}

			/* remove multiple entity selection for now

			if(this.UIElements["selection_rect"]) {
				var rect = this.UIElements["selection_rect"];
				rect.setWidth(mouse.x-rect.getX());
				rect.setHeight(mouse.y-rect.getY());
			}
			*/
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

			// update actors
			this.game.forEachActor((actor) => {
				var action = actor.update(this.game.pathfinder);
				if(action) {
					this.game.client.emitList(action);
				}
			});

			// update animations
			this.game.forEachEntity((entity) => {
				if(entity.currentAnimation) {
					entity.currentAnimation.update(time);
				}
			});

			// update ui
			var ui;
			for(var i in this.UIElements) {
				ui = this.UIElements[i];
				if(ui.update instanceof Function) {
					ui.update(this.game, time);
				}
			};
		}
	});

	return Play;
});