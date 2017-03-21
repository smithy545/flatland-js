define(["entity"], function(Entity) {
	var UI = Entity.extend({
		init: function(onTrigger, onUntrigger) {
			this._super();

			this.trigger_callback = onTrigger;
			this.untrigger_callback = onUntrigger;
		},
		trigger: function() {
			if(this.trigger_callback) {
				this.trigger_callback.apply(this, arguments);
			}
		},
		untrigger: function() {
			if(this.untrigger_callback) {
				this.untrigger_callback.apply(this, arguments);
			}
		}
	});

	return UI;
});