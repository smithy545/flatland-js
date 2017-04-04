define(["item"], function(Item) {
	var Fruit = Item.extend({
		init: function(id, x, y) {
			this._super(id, -1, x, y); // owned by nature

			this.width = 1;
			this.height = 1;
			
			this.type = "fruit";
			this.viewRadius = Types.getViewDistance(this.type);
		}
	});

	return Fruit;
});