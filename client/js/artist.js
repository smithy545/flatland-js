define([], function() {
	var Artist = {
		Person: function(ctx, e) {
			ctx.save();

			ctx.fillStyle = e.character;
			ctx.fillRect(e.getX(), e.getY(), e.getWidth(), e.getHeight());

			ctx.restore();
		},
		Tree: function(ctx, e) {
			ctx.save();

			ctx.strokeStyle = "#0f0";
			ctx.drawRect(e.getX(), e.getY(), e.getWidth(), e.getHeight());

			ctx.restore();
		},
		sprite: function(ctx, e) {
			
		}
	};

	return Artist;
});