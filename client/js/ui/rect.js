define(["ui"], function(UI) {
	var Rect = UI.extend({
		init: function(x, y, width, height, color, outlineColor, onTrigger, onUntrigger) {
			this._super(onTrigger, onUntrigger);

			this.setX(x);
			this.setY(y);
			this.setWidth(width);
			this.setHeight(height);

			this.type = "Rect";

			this.color = color || "#000";
			this.outline = outlineColor || this.color;
		},
		setColor: function(color) {
			this.color = color;
		},
		setOutline: function(outline) {
			this.outline = outline;
		}
	});

	return Rect;
})