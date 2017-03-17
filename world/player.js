var Class = require('../shared/class');
var Util = require('../shared/util');
var Area = require('./area');

var Player = Class.extend({
	init: function(name, id, socket) {
		this.name = name;
		this.id = id;
		this.entities = [];
		this.dirtyAreas = []; // visible areas dirty
		this.dirtiestArea = new Area(0,0,0,0); // widest possible viewport
		this.socket = socket;
	},
	toSendable: function() {
		var entities = [];
		this.entities.forEach((e) => {
			entities.push(e.toSendable());
		});
		return {
			name: this.name,
			id: this.id,
			entities: entities
		};
	},
	updateDirtyAreas: function(e) {
		for(var i = 0; i < this.dirtyAreas.length; i++) {
			if(this.dirtyAreas[i].surrounds(e)) {
				return; // moving entity still contained in same dirty rect
			}
		}

		var dirties = [];
		var minx=null, miny=null, maxx=null, maxy=null;

		this.entities.forEach((e) => {
			var vr = Types.VIEWDISTANCE[e.type];
			var a = new Area(e.x-vr, e.y-vr, 2*vr+1, 2*vr+1);
			if(minx) {
				minx = Math.min(minx, a.x);
				miny = Math.min(miny, a.y);
				maxx = Math.max(maxx, a.x+a.width);
				maxy = Math.max(maxy, a.y+a.height);
			} else {
				minx = a.x;
				miny = a.y;
				maxx = a.x+a.width;
				maxy = a.y+a.height;
			}
			a.addChild(e);
			dirties.push(a);
		});
		dirtiestArea = new Area(minx, miny, maxx-minx, maxy-miny);

		for(var i = 0; i < dirties.length; i++) {
			for(var j = i+1; j < dirties.length; j++) {
				if(dirties[i].collides(dirties[j])) {
					var temp = dirties[i];
					var x = Math.min(dirties[i].x, dirties[j].x);
					var y = Math.min(dirties[i].y, dirties[j].y);
					dirties[i] = new Area(x, y,
						Math.max(dirties[i].x+dirties[i].width, dirties[j].x+dirties[j].width) - x,
						Math.max(dirties[i].y+dirties[i].height, dirties[j].y+dirties[j].height) - y
					); // combine
					for(var k in temp.children) {
						dirties[i].addChild(temp.children[k]);
					}
					temp = dirties.splice(j, 1);
					for(var k in temp.children) {
						dirties[i].addChild(temp.children[k]);
					}
					j--; // rerun
				}
			}
		}

		this.dirtyAreas = dirties;
	},
	canSee: function(e) {
		if(dirtiestArea.collides(e)) { // possibly visible
			var vr = Types.VIEWDISTANCE[e.type], size = 2*vr+1;
			var entityArea = new Area(e.x-vr, e.y-vr, size, size);
			for(var i in this.dirtyAreas) { // check dirty areas
				if(this.dirtyAreas[i].collides(e)) {
					if(this.dirtyAreas[i].children.length > 1) { // if combo area
						for(var j in this.dirtyAreas[i].children) { // check specific areas
							if(Util.collides(this.dirtyAreas[i].children[j], entityArea)) { // collision
								return true;
							}
						}
					} else { // collision
						return true;
					}
				}
			}
		}

		return false;
	}
});

module.exports = Player;