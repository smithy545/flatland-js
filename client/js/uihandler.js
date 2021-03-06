define(["ui/rectoutline", "ui/rect", "ui/text", "ui/textrect", "ui/uientity"], function(RectOutline, Rect, Text, TextRect, UIEntity) {
	var UIHandler = {
		createRectOutline: function(x, y, width, height, color, trigger, untrigger, update) {
			return new RectOutline(x, y, width, height, color, trigger, untrigger, update);
		},
		createRect: function(x, y, width, height, color, outlineColor, trigger, untrigger, update) {
			return new Rect(x, y, width, height, color, outlineColor, trigger, untrigger, update);
		},
		createText: function(x, y, text, fontSize, font, color) {
			return new Text(x, y, text, fontSize, font, color);
		},
		createTextRect: function(x, y, width, height, text, fontSize, font, color, outlineColor, textColor, onTrigger, onUntrigger, update) {
			return new TextRect(x, y, width, height, text, fontSize, font, color, outlineColor, textColor, onTrigger, onUntrigger, update);
		},
		createUIEntity: function(x, y, width, height, type, trigger, untrigger, update) {
			return new UIEntity(x, y, width, height, type, trigger, untrigger, update);
		},
	};

	return UIHandler;
});