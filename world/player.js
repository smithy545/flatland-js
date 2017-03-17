var Class = require('../shared/class');
var Area = require('./area');

var Player = Class.extend({
	init: function(name, id, socket) {
		this.name = name;
		this.id = id;
		this.entities = [];
		this.dirtyAreas = []; // visible areas dirty
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
	updateDirtyAreas: function() {
		var dirties = [];

		this.entities.forEach((e) => {
			var vr = Types.VIEWDISTANCE[e.type]
			dirties.push(new Area(e.x-vr, e.y-vr, 2*vr+1, 2*vr+1));
		});

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
					dirties[i].addChild(temp);
					dirties[i].addChild(dirties.splice(j, 1));
					j--; // rerun
				}
			}
		}

		this.dirtyAreas = dirties;
	},
	canSee: function(e) {
		for(var i in this.dirtyAreas) { // check dirty areas
			if(this.dirtyAreas[i].collides(e)) {
				if(this.dirtyAreas[i].children.length > 0) { // if combo area
					for(var j in this.dirtyAreas[i].children) { // check specific areas
						if(this.dirtyAreas[i].children[j].collides(e)) {
							return true;
						}
					}
				} else {
					return true;
				}
			}
		}

		return false;
	}
});

module.exports = Player;