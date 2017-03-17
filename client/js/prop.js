define(["entity"], function(Entity) {
	var Prop = Entity.extend({
		init: function(id, owner, x, y) {
			this._super(); // call entity constructor
			this.owner = owner;
			this.setGridPosition(x, y);
			this.id = id;
		}
	});

	return Prop;
});