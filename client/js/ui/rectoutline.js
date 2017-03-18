define(["ui"], function(UI) {
	var RectOutline = UI.extend({
		init: function(x, y, width, height, color) {
			this._super();

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