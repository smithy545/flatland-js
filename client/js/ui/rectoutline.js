define(["ui"], function(UI) {
	var RectOutline = UI.extend({
		init: function(x, y, width, height, color, onTrigger, onUntrigger) {
			this._super(onTrigger, onUntrigger);

			this.setX(x);
			this.setY(y);
			this.setWidth(width);
			this.setHeight(height);

			this.type = "RectOutline";

			this.color = color || "#000";
		},
		setColor: function(color) {
			this.color = color;
		}
	});

	return RectOutline;
})