define(["entity"], function(Entity) {
	var Actor = Entity.extend({
		init: function(id, owner, x, y) {
			this._super(); // call entity constructor
			this.owner = owner;
			this.setGridPosition(x, y);
			this.id = id;
			this.path = [];
			this.target = null;
		},
		update: function() {
			// override this pls
		},
		setTarget: function(target) {
			this.target = target;
		}
	});

	return Actor;
});