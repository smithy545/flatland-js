define(["prop"], function(Prop) {
	var Wall = Prop.extend({
		init: function(id, owner, x, y, cost, built) {
			this._super(id, owner, x, y);

			this.width = 1;
			this.height = 1;
			
			this.type = "wall";
			this.viewRadius = Types.getViewDistance(this.type);
			
			this.cost = cost;
			this.built = built;

			this.drawType = "rect";
		}
	});

	return Wall;
});