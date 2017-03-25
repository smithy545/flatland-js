define(['lib/astar'], function(AStar) {
	var Pathfinder = Class.extend({
		init: function(map) {
			this.map = map;
		},
		pathTo: function(x1, y1, x2, y2) {
			// only works for one tile entities
			var result = AStar(this.map.pathingGrid, [x1,y1], [x2,y2], "Diagonal");
			result.shift(); // get rid of nonmove
			result.push(null); // add a path end
			result.reverse();

			return result;
		}
	});

	return Pathfinder;
});