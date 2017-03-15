define([], function() {
	var Entity = Class.extend({
		init: function() {
			this.x = 0;
			this.y = 0;
			this.width = 0;
			this.height = 0;
		},
		getX: function() {
			return this.x;
		},
		getY: function() {
			return this.y;
		},
		getWidth: function() {
			return this.width;
		},
		getHeight: function() {
			return this.height;
		}
	});

	return Entity;
});