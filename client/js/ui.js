define(["entity"], function(Entity) {
	var UI = Entity.extend({
		init: function(onTrigger, onUntrigger, update) {
			this._super();

			this.type = "UI";
			this.children = [this];

			this.trigger_callback = onTrigger;
			this.untrigger_callback = onUntrigger;
			this.update = update;
		},
		addChild: function(child) {
			this.children.push(child);
		},
		killChildren: function() {
			this.children = [this];
		},
		onUpdate: function(callback) {
			this.update = callback;
		},
		onTrigger: function(callback) {
			this.trigger_callback = callback;
		},
		onUntrigger: function(callback) {
			this.untrigger_callback = callback;
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