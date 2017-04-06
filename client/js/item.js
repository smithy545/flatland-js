define(["entity"], function(Entity) {
	var Item = Entity.extend({
		init: function(id, x, y) {
			this._super(); // call entity constructor
			this.owner = -1;
			this.setGridPosition(x, y);
			this.id = id;
		}
	});

	return Item;
});