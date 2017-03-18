define(["actor"], function(Actor) {
	var Person = Actor.extend({
		init: function(id, owner, character, x, y) {
			this._super(id, owner, x, y);

			this.setWidth(1);
			this.setHeight(1);
			this.type = "Person";
			this.viewRadius = Types.VIEWDISTANCE[this.type];

			this.character = character;
			this.queue = [];
		},
		update: function(pathfinder) {
			if(this.path.length > 0) {
				switch(this.path.pop()) {
					case Types.DIRECTIONS.UP:
						return [Types.MESSAGES.MOVE, this.id, this.gridX, this.gridY-1];
					case Types.DIRECTIONS.DOWN:
						return [Types.MESSAGES.MOVE, this.id, this.gridX, this.gridY+1];
					case Types.DIRECTIONS.RIGHT:
						return [Types.MESSAGES.MOVE, this.id, this.gridX+1, this.gridY];
					case Types.DIRECTIONS.LEFT:
						return [Types.MESSAGES.MOVE, this.id, this.gridX-1, this.gridY];
					default:
						this.target = this.queue.pop();
						return;
				}
			} else if(this.target != null) {
				this.path = pathfinder.pathTo(this.getGridX(), this.getGridY(), this.target.x, this.target.y);
			}
		},
		addToQueue: function(target) {
			this.queue.push(target);
		}
	});

	return Person;
});