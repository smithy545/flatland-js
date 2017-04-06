define([], function() {
	var Artist = {
		tree: function(ctx, e) {
			ctx.save();

			ctx.strokeStyle = "#0f0";
			ctx.strokeRect(e.getX(), e.getY(), e.getWidth(), e.getHeight());

			ctx.restore();
		},
		rectoutline: function(ctx, e) {
			ctx.save();

			ctx.strokeStyle = e.color;
			ctx.strokeRect(e.getX(), e.getY(), e.getWidth(), e.getHeight());

			ctx.restore();
		},
		rect: function(ctx, e) {
			ctx.save();

			ctx.strokeStyle = e.outline;
			ctx.strokeRect(e.getX(), e.getY(), e.getWidth(), e.getHeight());

			ctx.fillStyle = e.color;
			ctx.fillRect(e.getX(), e.getY(), e.getWidth(), e.getHeight());

			ctx.restore();
		},
		textrect: function(ctx, e) {
			ctx.save();

			ctx.strokeStyle = e.outline;
			ctx.strokeRect(e.getX(), e.getY(), e.getWidth(), e.getHeight());

			ctx.fillStyle = e.color;
			ctx.fillRect(e.getX(), e.getY(), e.getWidth(), e.getHeight());

			ctx.font = e.getFont();
			ctx.fillStyle = e.textColor;
			ctx.fillText(e.text, e.getTextX(), e.getTextY());

			ctx.restore();
		},
		text: function(ctx, e) {
			ctx.save();

			ctx.font = e.getFont();
			ctx.fillStyle = e.color;
			ctx.fillText(e.text, e.getX(), e.getY());

			ctx.restore();
		},
		sprite: function(ctx, entity) {
            var sprite = entity.sprite,
                anim = entity.currentAnimation;
        
            if(anim && sprite) {
                var	frame = anim.currentFrame,
                    // source coords
                    sx = frame.x,
                    sy = frame.y,
                    sw = sprite.width,
                    sh = sprite.height,
                    ox = sprite.offsetX,
                    oy = sprite.offsetY,

                    // destination coords
                    dx = entity.getX(),
                    dy = entity.getY(),
                    dw = entity.getWidth(),
                    dh = entity.getHeight();
            	
                ctx.save();
                if(entity.flipSpriteX) {
                    ctx.translate(dx + TILESIZE, dy);
                    ctx.scale(-1, 1);
                }
                else if(entity.flipSpriteY) {
                    ctx.translate(dx, dy + dh);
                    ctx.scale(1, -1);
                }
                else {
                    ctx.translate(dx, dy);
                }
            
                ctx.drawImage(sprite.image, sx, sy, sw, sh, ox, oy, dw, dh);
            
                ctx.restore();
            }
		},
		tile: function(ctx, tileset, map, type, x, y) {
			var ts = map.tilesize;
			ctx.drawImage(tileset, ts*(type%map.tilesetWidth), ts*Math.floor(type/map.tilesetWidth), ts, ts, x, y, TILESIZE, TILESIZE)
		}
	};

	return Artist;
});