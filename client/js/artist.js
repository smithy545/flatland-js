define([], function() {
	var Artist = {
		Person: function(ctx, e) {
			var halfWidth = e.getWidth()*0.5;

			ctx.save();

			ctx.fillStyle = "#f00";
			ctx.strokeStyle = "#000";
			ctx.beginPath();
			ctx.arc(e.getX()+halfWidth, e.getY()+halfWidth, halfWidth, 0, 2*Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();

			ctx.restore();
		},
		Tree: function(ctx, e) {
			ctx.save();

			ctx.strokeStyle = "#0f0";
			ctx.strokeRect(e.getX(), e.getY(), e.getWidth(), e.getHeight());

			ctx.restore();
		},
		RectOutline: function(ctx, e) {
			ctx.save();

			ctx.strokeStyle = e.color;
			ctx.strokeRect(e.getX(), e.getY(), e.getWidth(), e.getHeight());

			ctx.restore();
		},
		Rect: function(ctx, e) {
			ctx.save();

			ctx.strokeStyle = e.outline;
			ctx.strokeRect(e.getX(), e.getY(), e.getWidth(), e.getHeight());

			ctx.fillStyle = e.color;
			ctx.fillRect(e.getX(), e.getY(), e.getWidth(), e.getHeight());

			ctx.restore();
		},
		sprite: function(ctx, e) {
			
		}
	};

	return Artist;
});