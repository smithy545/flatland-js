var Util = {};

Util.contains = function(r, x, y) {
	return x > r.getX() && x < r.getX() + r.getWidth()
		&& y > r.getY() && y < r.getY() + r.getHeight();
}

Util.collides = function(r1, r2) {
	return r1.getX() < r2.getX() + r2.getWidth() && r1.getX() + r1.getWidth() > r2.getX()
		&& r1.getY() < r2.getY() + r2.getHeight() && r1.getY() + r1.getHeight() > r2.getY();
}

Util.surrounds = function(outer, inner) {
	return contains(outer, inner.getX(), inner.getY())
		&& contains(outer, inner.getX()+inner.getWidth(), inner.getY())
		&& contains(outer, inner.getX(), inner.getY()+inner.getHeight())
		&& contains(outer, inner.getX()+inner.getWidth(), inner.getY()+inner.getHeight());
}

Util.nextFreeTile = function(grid, tile) {
	var i = 0;
	while(tile.x + i < grid[0].length && tile.x - i >= 0
		&& tile.y + i < grid.length && tile.y - i >= 0) {
		for(var x = tile.x - i; x < tile.x + i; x++) {
			for(var y = tile.y - i; y < tile.y + i; y++) {
				if(!grid[y][x]) {
					return {
						x: x,
						y: y
					};
				}
			}
		}

		i++;
	}

	return null;
}

if(!(typeof module == 'undefined')) {
	module.exports = Util;
}