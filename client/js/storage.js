define(["lib/js.cookie"], function(Cookie) {
	var Storage = Class.extend({
		init: function() {
			this.id = parseInt($("#playerId").text());
		}
	});

	return Storage;
});