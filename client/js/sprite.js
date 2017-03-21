// need to do a lot of stuff with this

define(['animation', 'sprites'], function(Animation, sprites) {
    var Sprite = Class.extend({
        init: function(info, onLoad) {
            this.id = info.id;
        	this.filepath = "img/sprites/" + info.id + ".png";
        	this.isLoaded = false;
        	this.offsetX = info.offsetX || 0;
        	this.offsetY = info.offsetY || 0;

            this.width = info.width;
            this.height = info.height;

            this.animationData = info.animations;

            this.ready_callback = onLoad;

            this.load();
        },
        load: function() {
        	this.image = new Image();
        	this.image.src = this.filepath;

        	this.image.onload = () => {
        		this.isLoaded = true;
                this.ready_callback(this.id);
        	};
        },
        createAnimations: function() {
            var animations = {};
        
    	    for(var name in this.animationData) {
    	        var a = this.animationData[name];
    	        animations[name] = new Animation(name, a.length, a.row, this.width, this.height);
    	    }
	        
    	    return animations;
    	},
    });

    return Sprite;
});