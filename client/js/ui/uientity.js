define(["ui"], function(UI) {
	var UIEntity = UI.extend({
		init: function(x, y, width, height, type, onTrigger, onUntrigger, update) {
			this._super(onTrigger, onUntrigger, update);

			this.setX(x);
			this.setY(y);
			this.setWidth(width);
			this.setHeight(height);

			this.type = type; // fake typing for artist
			this.built = true; // always built if prop
		}
	});

	return UIEntity;
})