define([], function() {
	var Map = Class.extend({
		init: function(filename) {
			this.isLoaded = false;
            var filepath = "/" + filename;
            $.get(filepath, (data) => {
				this.entityGrid = [];
				this.pathingGrid = [];

				this.width = data.width;
				this.height = data.height;

				this.tiles = data.tiles;
				this.tilesize = data.tilesize;
				this.tilesetWidth = data.tilesetWidth;
				this.tilesetHeight = data.tilesetHeight;

				for(var i = 0; i < this.height; i++) {
					this.entityGrid[i] = [];
					this.pathingGrid[i] = [];
					for(var j = 0; j < this.width; j++) {
						this.entityGrid[i][j] = null;
						this.pathingGrid[i][j] = false;
					}
				}
				this.isLoaded = true;
            }, 'json');
		},
		entityAt: function(x, y) {
			return this.entityGrid[y][x];
		},
		blocked: function(x, y, w, h) {
			w = w || 1;
			h = h || 1;
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
			this.entityGrid[e.getGridY()][e.getGridX()] = e;
			for(var i = 0; i < e.height; i++) {
				for(var j = 0; j < e.width; j++) {
					this.pathingGrid[e.getGridY()+i][e.getGridX()+j] = true;
				}
			}
		},
		unregisterEntity: function(e) {
			this.entityGrid[e.getGridY()][e.getGridX()] = null;
			for(var i = 0; i < e.height; i++) {
				for(var j = 0; j < e.width; j++) {
					this.pathingGrid[e.getGridY()+i][e.getGridX()+j] = false;
				}
			}
		},
		getTileAt: function(x, y) {
			return this.tiles[y*this.width+x];
		}
	});

	return Map;
});