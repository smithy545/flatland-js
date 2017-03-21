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
		canSee: function(e) {
			return e.getX() < this.x + this.getWidth() && e.getX() + e.getWidth() > this.x
				&& e.getY() < this.y + this.getHeight() && e.getY() + e.getHeight() > this.y;
		}
	});

	return Camera;
});