define(["actor"], function(Actor) {
	var Person = Actor.extend({
		init: function(id, owner, x, y) {
			this._super(id, owner, x, y);

			this.width = 1;
			this.height = 1;
			this.type = "Person";
			this.viewRadius = 10;
			this.startX = x;
		},
		update: function() {
			if(this.gridX < this.startX+10) {	
				return [Types.MESSAGES.MOVE, this.id, this.gridX+1, this.gridY];
			}
		}
	});

	return Person;
});