pc.script.attribute("max_platform_width", "number", 20);
pc.script.attribute("max_platform_height", "number", 20);
pc.script.attribute("max_platform_distance", "number", 20);

pc.script.create('platform_generator', function (context) {
    // Creates a new Platform_generator instance
    var Platform_generator = function (entity) {
        this.entity = entity;
        
        this.coveredDistance = 5;
    };

    Platform_generator.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.player = context.root.findByName("player");
            this.camera = context.root.findByName("playercamera").camera;
            
            console.log(this.player);
            console.log(this.camera);
            //console.log(this.camera)
            this.cameraWidth = this.camera.orthoHeight * this.camera.aspectRatio;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            //console.log(this.player.position.x + this.cameraWidth);
            
            //console.log(this.player.position.toString());
            if(this.player.position.x + this.cameraWidth > this.coveredDistance){
                
                console.log("adding platform!");
                var entity = new pc.fw.Entity();
                
                context.systems.model.addComponent(entity, {
                    type: 'box'
                });
                
                
                var width = pc.math.random(1, this.max_platform_width);
                var dist = pc.math.random(0, this.max_platform_distance);
                
                var height = pc.math.random(0, this.max_platform_height);
                
                entity.setLocalPosition(
                    this.coveredDistance + width / 2 + dist ,
                    height,
                    0
                );
                
                entity.setLocalScale(width, 1, 1);
                
                context.root.addChild(entity);
                
                this.coveredDistance += dist + width;
            }
        }
    };

    return Platform_generator;
});