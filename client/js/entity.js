define([], function() {
	var Entity = Class.extend({
		init: function() {
			this.x = 0;
			this.y = 0;
			this.gridX = 0;
			this.gridY = 0;
			this.width = 0;  // in grid tiles
			this.height = 0; // in grid tiles
			this.visible = true;
			this.type = null;
			this.viewRadius = 0;
			this.owner = -1;
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
		}
	});

	return Entity;
});