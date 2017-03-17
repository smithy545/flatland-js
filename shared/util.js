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

if(!(typeof module == 'undefined')) {
	module.exports = Util;
}