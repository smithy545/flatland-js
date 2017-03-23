define(["ui/rectoutline", "ui/rect", "ui/text"], function(RectOutline, Rect, Text) {
	var UIHandler = {
		createRectOutline: function(x, y, width, height, color, trigger, untrigger, update) {
			return new RectOutline(x, y, width, height, color, trigger, untrigger, update);
		},
		createRect: function(x, y, width, height, color, outlineColor, trigger, untrigger, update) {
			return new Rect(x, y, width, height, color, outlineColor, trigger, untrigger, update);
		},
		createText: function(x, y, text, fontSize, font, color) {
			return new Text(x, y, text, fontSize, font, color);
		}
	};

	return UIHandler;
});