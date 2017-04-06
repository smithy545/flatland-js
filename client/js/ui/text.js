define(["ui"], function(UI) {
	var Text = UI.extend({
		init: function(x, y, text, fontSize, font, color) {
			this._super(null, null, null);

			this.setX(x);
			this.setY(y);
			this.setWidth(0);
			this.setHeight(0);

			this.type = "text";
			
			this.text = text;
			this.color = color || "#000";
			this.font = font || "Arial";
			this.fontSize = "" + (fontSize || 24);
		},
		setColor: function(color) {
			this.color = color;
		},
		setFont: function(font) {
			this.font = font;
		},
		setText: function(text) {
			this.text = text;
		},
		setFontSize: function(fontSize) {
			this.fontSize = fontSize;
		},
		getFont: function() {
			return this.fontSize + "px " + this.font
		}
	});

	return Text;
})