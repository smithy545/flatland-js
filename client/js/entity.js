define([], function() {
	var Entity = Class.extend({
		init: function() {
			this.setPosition(0, 0);
			this.setGridWidth(0);
			this.setGridHeight(0);
			this.visible = true;
			this.type = null;
			this.viewRadius = 0;
			this.owner = -1;
			this.state = null;

			// for sprite entities
			this.isLoaded = false;
			this.animations = null;
			this.currentAnimation = null;
			this.flipSpriteX = false;
			this.flipSpriteY = false;
		},
		setState: function(state) {
			this.state = state;
			if(this.type === 'sprite') {
				this.flipSpriteX = false;
				if(state.endsWith("left")) {
					this.flipSpriteX = true;
					this.setAnimation(state.substring(0,state.length-4)+"right", 100);
				} else {
					this.setAnimation(state, 100);
				}
			}
		},
		getState: function() {
			return this.state;
		},
		getX: function() {
			return this.x;
		},
		getY: function() {
			return this.y;
		},
		getGridX: function() {
			return this.gridX;
		},
		getGridY: function() {
			return this.gridY;
		},
		getWidth: function() {
			return this.width*TILESIZE;
		},
		getHeight: function() {
			return this.height*TILESIZE;
		},
		getGridWidth: function() {
			return this.width;
		},
		getGridHeight: function() {
			return this.height;
		},
		setWidth: function(width) {
			if(width > 0) {
				this.width = Math.ceil(width/TILESIZE);
			} else {
				this.width = Math.floor(width/TILESIZE);
			}
		},
		setHeight: function(height) {
			if(height > 0) {
				this.height = Math.ceil(height/TILESIZE);
			} else {
				this.height = Math.floor(height/TILESIZE);
			}
		},
		setGridWidth: function(width) {
			this.width = width;
		},
		setGridHeight: function(height) {
			this.height = height;
		},
		setVisible: function(val) {
			this.visible = val || true;
		},
		setInvisible: function() {
			this.visible = false;
		},
		isVisible: function() {
			return this.visible;
		},
		setX: function(x) {
			this.x = x;
			this.gridX = Math.floor(x/TILESIZE);
		},
		setY: function(y) {
			this.y = y;
			this.gridY = Math.floor(y/TILESIZE);
		},
		setGridX: function(x) {
			this.x = x*TILESIZE;
			this.gridX = x;
		},
		setGridY: function(y) {
			this.y = y*TILESIZE;
			this.gridY = y;
		},
		setPosition: function(x, y) {
			this.x = x;
			this.y = y;

			this.gridX = Math.floor(x/TILESIZE);
			this.gridY = Math.floor(y/TILESIZE);
		},
		setGridPosition: function(x, y) {
			this.x = x*TILESIZE;
			this.y = y*TILESIZE;

			this.gridX = x;
			this.gridY = y;
		},

		// sprite functions
		setSprite: function(sprite, ready_callback) {
			if(this.type != 'sprite') {
				console.error("This is not a sprite entity");
				throw "Error";
			} else if(!sprite) {
    	        console.error(this.id + " : sprite is null");
    	        throw "Error";
    	    }
	    
    	    if(this.sprite && this.sprite.name === sprite.name) {
    	        return;
    	    }

    	    this.sprite = sprite;
    		this.animations = sprite.createAnimations();
		
    		this.isLoaded = true;
    		if(ready_callback) {
    			ready_callback(this);
    		}
		},
    	getAnimationByName: function(name) {
            var animation = null;
        
            if(name in this.animations) {
                animation = this.animations[name];
            }
            else {
                console.error("No animation called "+ name);
            }
            return animation;
        },
    	setAnimation: function(name, speed, count, onEndCount) {	    
            if(this.isLoaded) {
    		    if(this.currentAnimation && this.currentAnimation.name === name) {
    		        return;
    		    }
		    
    		    var s = this.sprite,
                    a = this.getAnimationByName(name);
		
    			if(a) {
    				this.currentAnimation = a;
    				this.currentAnimation.setSpeed(speed);
    				this.currentAnimation.setCount(count ? count : 0, onEndCount || function() {
    				    //this.idle();
    				});
    			}
    		}
    		else {
    			console.error("Not ready for animation");
    		}
    	},
	});

	return Entity;
});