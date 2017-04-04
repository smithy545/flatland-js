define(["prop"], function(Prop) {
	var Wall = Prop.extend({
		init: function(id, owner, x, y) {
			this._super(id, owner, x, y); // owned by nature

			this.width = 1;
			this.height = 1;
			
			this.type = "wall";
			this.viewRadius = Types.getViewDistance(this.type);
		}
	});

	return Wall;
});