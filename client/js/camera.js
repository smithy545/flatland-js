define([], function() {
	var Camera = Class.extend({
		init: function(renderer, x, y, scale) {
			this.renderer = renderer;	// parent renderer
			this.x = x || 0;			// x-coordinate
			this.y = y || 0;			// y-coordinate
			this.scale = scale || 1.0;	// scale/zoom factor
		},
		getX: function() {
			return this.x;
		},
		getY: function() {
			return this.y;
		},
		getGridX: function() {
			return Math.floor(this.x/TILESIZE);
		},
		getGridY: function() {
			return Math.floor(this.y/TILESIZE);
		},
		getWidth: function() {
			return this.renderer.getWidth();
		},
		getHeight: function() {
			return this.renderer.getHeight();
		},
		setScale: function(scale) {
			this.scale = scale;
		},
		setX: function(x) {
			this.x = x;
		},
		setY: function(y) {
			this.y = y;
		},
		setGridX: function(x) {
			this.x = x*TILESIZE;
		},
		setGridY: function(y) {
			this.y = y*TILESIZE;
		},
		canSee: function(e) {
			return e.getX() < this.x + this.getWidth() && e.getX() + e.getWidth() > this.x
				&& e.getY() < this.y + this.getHeight() && e.getY() + e.getHeight() > this.y;
		},
		focusEntity: function(e) {
			if(e.getX() > this.renderer.getWidth()/2) {
				this.setX(e.getX()-this.renderer.getWidth()/2);
			} else {
				this.setX(0);
			}
			if(e.getY() > this.renderer.getHeight()/2) {
				this.setY(e.getY()-this.renderer.getHeight()/2);
			} else {
				this.setY(0);
			}
		},
		focusObject: function(o) {
			if(o.x > this.renderer.getWidth()/2) {
				this.setX(o.x-this.renderer.getWidth()/2);
			} else {
				this.setX(0);
			}
			if(o.y > this.renderer.getHeight()/2) {
				this.setY(o.y-this.renderer.getHeight()/2);
			} else {
				this.setY(0);
			}
		},
		focusGridObject: function(o) {
			if(o.x*TILESIZE > this.renderer.getWidth()/2) {
				this.setX(o.x*TILESIZE-this.renderer.getWidth()/2);
			} else {
				this.setX(0);
			}
			if(o.y*TILESIZE > this.renderer.getHeight()/2) {
				this.setY(o.y*TILESIZE-this.renderer.getHeight()/2);
			} else {
				this.setY(0);
			}
		}
	});

	return Camera;
});