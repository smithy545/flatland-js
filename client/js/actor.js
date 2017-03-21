define(["entity"], function(Entity) {
	var Actor = Entity.extend({
		init: function(id, owner, x, y) {
			this._super(); // call entity constructor
			this.owner = owner;
			this.setGridPosition(x, y);
			this.id = id;
			this.path = [];		// for pathing
			this.queue = [];	// for thinking

			this.target = null;
		},
		update: function() {
			// pls override
		},
		setTarget: function(target) {
			this.target = target;
		}
	});

	return Actor;
});