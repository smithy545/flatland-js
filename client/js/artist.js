define([], function() {
	var Artist = {
		Person: function(ctx, e) {
			ctx.save();

			ctx.fillStyle = e.character;
			ctx.strokeStyle = "#000";
			ctx.beginPath();
			ctx.arc(e.getX(), e.getY(), e.getWidth()/2, 0, 2*Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();

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