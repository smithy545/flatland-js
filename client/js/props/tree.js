define(["prop"], function(Prop) {
	var Tree = Prop.extend({
		init: function(id, x, y) {
			this._super(id, -1, x, y); // owned by nature

			this.width = 1;
			this.height = 1;
			
			this.type = "tree";
			this.viewRadius = Types.getViewDistance(this.type);

			this.passable = true;
			this.built = true;
		}
	});

	return Tree;
});