define(["entity"], function(Entity) {
	var UI = Entity.extend({
		init: function(onTrigger, onUntrigger, update) {
			this._super();

			this.type = "UI";

			this.trigger_callback = onTrigger;
			this.untrigger_callback = onUntrigger;
			this.update = update;
		},
		setUpdate: function(callback) {
			this.update = callback;
		},
		trigger: function() {
			if(this.trigger_callback) {
				return this.trigger_callback.apply(this, arguments);
			}
		},
		untrigger: function() {
			if(this.untrigger_callback) {
				return this.untrigger_callback.apply(this, arguments);
			}
		}
	});

	return UI;
});