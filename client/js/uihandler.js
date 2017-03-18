define(["ui/rectoutline", "ui/rect"], function(RectOutline, Rect) {
	var UIHandler = {
		createRectOutline: function(x, y, width, height, color) {
			return new RectOutline(x, y, width, height, color);
		},
		createRect: function(x, y, width, height, color, outlineColor) {
			return new Rect(x, y, width, height, color, outlineColor);
		}
	};

	return UIHandler;
});