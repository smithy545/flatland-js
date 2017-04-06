define(["ui"], function(UI) {
	var TextRect = UI.extend({
		init: function(x, y, width, height, text, fontSize, font, color, outlineColor, textColor, onTrigger, onUntrigger, update) {
			this._super(onTrigger, onUntrigger, update);

			this.text = text;
			this.fontSize = fontSize || 16;
			this.font = font || "Arial";

			this.setX(x);
			this.setY(y);
			this.setWidth(width);
			this.setHeight(height);

			this.type = "textrect";

			this.color = color || "#000";
			this.outline = outlineColor || this.color;

			this.textColor = textColor;
		},
		setX: function(x) {
			this._super(x);
			this.updateTextCoords();
		},
		setY: function(y) {
			this._super(y);
			this.updateTextCoords();
		},
		setWidth: function(width) {
			this._super(width);
			this.updateTextCoords();
		},
		setHeight: function(height) {
			this._super(height);
			this.updateTextCoords();
		},
		setColor: function(color) {
			this.color = color;
		},
		setOutline: function(outline) {
			this.outline = outline;
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
		updateTextCoords: function() {
			this.textX = Math.max(this.x, this.x + this.getWidth()*0.5 - this.text.length*0.5*this.fontSize);
			this.textY = this.y + 0.5*(this.getHeight() + this.fontSize);
		},
		getFont: function() {
			return this.fontSize + "px " + this.font
		},
		getTextX: function() {
			return this.textX;
		},
		getTextY: function() {
			return this.textY;
		},
	});

	return TextRect;
})