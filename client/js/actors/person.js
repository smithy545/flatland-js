define(["actor"], function(Actor) {
	var Person = Actor.extend({
		init: function(id, owner, character, x, y) {
			this._super(id, owner, x, y);

			this.setWidth(1);
			this.setHeight(1);

			this.type = "Person";
			this.viewRadius = Types.VIEWDISTANCE["Person"];

			this.character = character;
			this.queue = [];
		},
		update: function(pathfinder) {
			if(this.path.length > 0) {
				var move = this.path.pop();
				if(move) {
					return [Types.MESSAGES.MOVE, this.id, move[0], move[1]];
				} else {
					this.target = this.queue.pop();
				}
			} else if(this.target) {
				this.path = pathfinder.pathTo(this.getGridX(), this.getGridY(), this.target.x, this.target.y);
			}
		},
		addToQueue: function(target) {
			this.queue.push(target);
		}
	});

	return Person;
});