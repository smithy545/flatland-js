define(["prop"], function(Prop) {
	var SpawnArea = Prop.extend({
		init: function(id, owner, x, y) {
			this._super(id, owner, x, y);

			this.width = 2;
			this.height = 2;
			this.type = "SpawnArea";
			this.viewRadius = Types.VIEWDISTANCE[this.type];
		}
	});

	return SpawnArea;
});