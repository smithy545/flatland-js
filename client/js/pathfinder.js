define([], function() {
	var Pathfinder = Class.extend({
		init: function(map) {
			this.map = map;
		},
		pathTo: function(x1, y1, x2, y2) {
			var path = [null]; // last item is null

			// TODO: A* pathing
			// very simple path making for now
			for(var i = x1; i < x2; i++) {
				path.push(Types.DIRECTIONS.RIGHT);
			}
			for(var i = x1; i > x2; i--) {
				path.push(Types.DIRECTIONS.LEFT);
			}
			for(var i = y1; i < y2; i++) {
				path.push(Types.DIRECTIONS.DOWN);
			}
			for(var i = y1; i > y2; i--) {
				path.push(Types.DIRECTIONS.UP);
			}

			return path;
		}
	});

	return Pathfinder;
});