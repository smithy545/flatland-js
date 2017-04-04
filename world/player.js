var Class = require('../shared/class');
var Util = require('../shared/util');
var Types = require('../shared/constants');
var Area = require('./area');

var Player = Class.extend({
	init: function(name, id, socket) {
		this.name = name;
		this.id = id;
		this.entities = [];
		this.dirtyArea = new Area(0,0,0,0); // widest possible viewport
		this.socket = socket;
	},
	toSendable: function() {
		return {
			name: this.name,
			id: this.id,
		};
	},
	createDirtyArea: function() {
		var minx=null, miny=null, maxx=null, maxy=null;

		this.entities.forEach((e) => {
			var vr = Types.getViewDistance(e.type);
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
		});
		this.dirtiestArea = new Area(minx, miny, maxx-minx, maxy-miny);
	},
	canSee: function(e) {
		var child, childArea, vr;
		if(this.dirtiestArea.collides(e)) { // if possibly visible
			for(var i in this.entities) { // check entity views
				var ent = this.entities[i];
				var vr = Types.getViewDistance(ent.type);
				var view = new Area(ent.getX()-vr, ent.getY()-vr, 2*vr+1, 2*vr+1);
				if(view.collides(e)) {
					return true;
				}
			}
		}

		return false;
	},
	whoCanSee: function(e) {
		var child, childArea, vr;
		var visibleTo = [];
		if(this.dirtiestArea.collides(e)) { // if possibly visible
			for(var i in this.entities) { // check entity views
				var ent = this.entities[i];
				var vr = Types.getViewDistance(ent.type);
				var view = new Area(ent.getX()-vr, ent.getY()-vr, 2*vr+1, 2*vr+1);
				if(view.collides(e)) {
					visibleTo.push(ent.id);
				}
			}
		}

		return visibleTo;
	}
});

module.exports = Player;