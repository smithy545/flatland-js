var Class = require('../shared/class');

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
		this.entities.forEach((e) => {

		});
	},
	canSee: function(e) {
		for(var i in this.dirtyAreas) { // check dirty areas
			if(this.dirtyAreas[i].collides(e)) {
				for(var j in this.dirtyAreas[i].children) { // check specific areas
					if(this.dirtyAreas[i].children[j].collides(e)) {
						return true;
					}
				}
			}
		}

		return false;
	}
});

module.exports = Player;