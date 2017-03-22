var Class = require('../shared/class');

var Map = Class.extend({
	init: function(filename) {
		this.isLoaded = false;

		var info = require(filename);

		this.entityGrid = [];
		this.pathingGrid = [];
		this.tiles = info.tiles;
		this.width = info.width;
		this.height = info.height;
		for(var i = 0; i < this.height; i++) {
			this.entityGrid[i] = [];
			this.pathingGrid[i] = [];
			for(var j = 0; j < this.width; j++) {
				this.entityGrid[i][j] = null;
				this.pathingGrid[i][j] = false;
			}
		}

		this.isLoaded = true;
	},
	entityAt: function(x, y) {
		return this.entityGrid[y][x];
	},
	blocked: function(x, y, w, h) {
		if(x < 0 || y < 0 || x+w >= this.width || y+h >= this.height) {
			return true;
		}
		for(var i = 0; i < h; i++) {
			for(var j = 0; j < w; j++) {
				if(this.pathingGrid[y+i][x+j]) {
					return true;
				}
			}
		}
		return false;
	},
	registerEntity: function(e) {
		this.entityGrid[e.y][e.x] = e;
		for(var i = 0; i < e.height; i++) {
			for(var j = 0; j < e.width; j++) {
				this.pathingGrid[e.y+i][e.x+j] = true;
			}
		}
	},
	unregisterEntity: function(e) {
		this.entityGrid[e.y][e.x] = null;
		for(var i = 0; i < e.height; i++) {
			for(var j = 0; j < e.width; j++) {
				this.pathingGrid[e.y+i][e.x+j] = false;
			}
		}
	},
	toSendable: function() {
		return {
			width: this.width,
			height: this.height
		};
	}
});

module.exports = Map;