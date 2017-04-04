define(["ui"], function(UI) {
	var Rect = UI.extend({
		init: function(x, y, width, height, color, outlineColor, onTrigger, onUntrigger, update) {
			this._super(onTrigger, onUntrigger, update);

			this.setX(x);
			this.setY(y);
			this.setWidth(width);
			this.setHeight(height);

			this.type = "rect";

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