define(["actor"], function(Actor) {
	var Monster = Actor.extend({
		init: function(id, x, y) {
			this._super(id, -1, x, y); // no owner

			this.setWidth(1);
			this.setHeight(1);

			this.setWidth(1);
			this.setHeight(1);
			this.viewRadius = Types.VIEWDISTANCE["Monster"];

			this.type = "sprite";
			this.spriteName = "monster";
		},
		update: function(pathfinder) {
			// thoughts here
		}
	});

	return Monster;
});