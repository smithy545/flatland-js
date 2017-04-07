define(["state", "uihandler", "actor", "entityfactory"], function(State, UIHandler, Actor, EntityFactory) {
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
				"Structures": this.structureButton.bind(this),
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
					return true;
				};
				ui_elements[name+"_button"] = UIHandler.createTextRect(buttonWidth*Math.floor(i/3), (i%3)*buttonHeight+height-ui_height, buttonWidth, buttonHeight,
					name, buttonFontSize, null, "#888", "#000", "#000", null, True);
				ui_elements[name+"_button"].onTrigger(press_callback.bind(ui_elements[name+"_button"]));
			}

			this.UIElements["entity_view"] = UIHandler.createRect(width-ui_height,
				height-ui_height,
				ui_height, ui_height, "#888", "#000", null, null,
				function() {
					var fontSize = 12;
					ui_elements["entity_view"].killChildren();
					if(self.selected) {
						ui_elements["entity_view"].addChild(UIHandler.createText(width-ui_height+5, height-ui_height+fontSize,
							"type = " + self.selected.type, fontSize));
						ui_elements["entity_view"].addChild(UIHandler.createText(width-ui_height+5, height-ui_height+fontSize*2,
							"x = " + self.selected.gridX, fontSize));
						ui_elements["entity_view"].addChild(UIHandler.createText(width-ui_height+5, height-ui_height+fontSize*3,
							"y = " + self.selected.gridY, fontSize));
					} else {
						ui_elements["entity_view"].addChild(UIHandler.createText(width-ui_height+5, height-ui_height+fontSize,
							"type = ", fontSize));
						ui_elements["entity_view"].addChild(UIHandler.createText(width-ui_height+5, height-ui_height+fontSize*2,
							"x = ", fontSize));
						ui_elements["entity_view"].addChild(UIHandler.createText(width-ui_height+5, height-ui_height+fontSize*3,
							"y = ", fontSize));
					}
				});
		},
		structureButton: function(pressed, button) {
			if(pressed) {	// create
				let j = 0;
				for(var i in Kinds) {
					if(Kinds[i][1] == 'prop') {
						let x = 2*button.getWidth()+j*(2*TILESIZE+10);
						let y = button.getY();
						let prop = UIHandler.createUIEntity(x+TILESIZE*0.5, y+TILESIZE*0.5, TILESIZE, TILESIZE, i);
						let propBox = UIHandler.createRect(x, y, 2*TILESIZE, 2*TILESIZE, "#888", "#000", True, () => {
							if(this.selected) {
								this.selected.setSelected(false);
							}
							this.selected = null;

							for(var j in this.game.entities) {
								this.game.client.emit(Types.Messages.BUILD, j, prop.type, 500, 500);
							}

							return true;
						});
						button.addChild(propBox);
						button.addChild(prop);
					}
					j++;
				}
			} else {		// destroy
				button.killChildren();
			}
		},
		mousedown: function(mouse) {
			var camera = this.game.renderer.camera,
				triggered = false,
				ui;
			
			for(var i in this.UIElements) {
				this.UIElements[i].children.forEach((ui) => {
					if(Util.contains(ui, mouse.x, mouse.y)) {
						triggered = ui.trigger() || triggered;
					}
				});
			}
			if(!triggered) {
				if(mouse.button === 0) {
					// make rect yellow for highlighting
					this.UIElements["selection_rect"] = UIHandler.createRectOutline(
						mouse.x-(mouse.x+camera.getX())%TILESIZE,
						mouse.y-(mouse.y+camera.getY())%TILESIZE,
						TILESIZE, TILESIZE, "#0ff");
				}					
			}
		},
		mouseup: function(mouse) {
			var camera = this.game.renderer.camera,
				entity,
				foundEntities,
				ui,
				x, y,
				triggered = false;

			for(var i in this.UIElements) {
				this.UIElements[i].children.forEach((ui) => {
					if(Util.contains(ui, mouse.x, mouse.y)) {
						triggered = ui.untrigger() || triggered;
					}
				});
			}

			if(!triggered) {
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
				} else if(mouse.button === 0) { // select units
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
				}
			}
		},
		mousemove: function(mouse) {
			var camera = this.game.renderer.camera,
				rect = this.UIElements["selection_rect"],
				x = mouse.x-(camera.getX()+mouse.x)%TILESIZE,
				y = mouse.y-(camera.getY()+mouse.y)%TILESIZE;

			if(rect && rect.getX() != x || rect.getY() != y) {
				if(mouse.pressed) {
					this.UIElements["selection_rect"] = UIHandler.createRectOutline(x, y, TILESIZE, TILESIZE, "#0ff");
				} else if(this.game.map.blocked(Math.floor(x/TILESIZE), Math.floor(y/TILESIZE)) && this.selected) {
					this.UIElements["selection_rect"] = UIHandler.createRectOutline(x, y, TILESIZE, TILESIZE, "#f00");
				} else {
					this.UIElements["selection_rect"] = UIHandler.createRectOutline(x, y, TILESIZE, TILESIZE, "#ccc");
				}
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

			// update entities
			this.game.forEachEntity((entity) => {
				var action;
				if(this.game.actors[entity.id]) { // if valid actor
					action = entity.update(this.game.pathfinder);
					if(action) {
						this.game.client.emitList(action);
					}
				}

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