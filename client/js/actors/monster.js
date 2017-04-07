define(["actor"], function(Actor) {
	var Monster = Actor.extend({
		init: function(id, x, y) {
			this._super(id, -1, x, y); // no owner

			this.width = 1;
			this.height = 1;
			
			this.type = "monster";
			this.viewRadius = Types.getViewDistance(this.type);

			this.useSprite = true;
			this.spriteName = "monster";
		}
	});

	return Monster;
});