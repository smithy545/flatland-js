define(["actor"], function(Actor) {
	var Person = Actor.extend({
		init: function(id, owner, character, x, y) {
			this._super(id, owner, x, y);

			this.setWidth(1);
			this.setHeight(1);

			this.type = "person";
			this.viewRadius = Types.getViewDistance(this.type);

			this.useSprite = true;
			this.spriteName = "person";

			this.character = character;
			this.queue = [];
		},
		update: function(pathfinder) {
			if(this.path.length > 0) {
				var move = this.path.pop();
				if(move) {
					if(move[0] != this.gridX) {
						if(move[0] > this.gridX) {
							this.setState('walk_right')
						} else {
							this.setState('walk_left');
						}

					} else if(move[1] > this.gridY) {
						this.setState('walk_down');
					} else {
						this.setState('walk_up');
					}
					return [Types.Messages.MOVE, this.id, move[0], move[1]];
				} else {
					this.setState('idle_down');
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