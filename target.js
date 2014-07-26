pc.script.attribute("materials", "asset", [], {type: "material"});

pc.script.create('target', function (context) {
    // Creates a new Target instance
    var Target = function (entity) {
        this.entity = entity;
    };

    Target.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.totalTime = 0;
            
            this.greenMaterial = context.assets.find('target_green', pc.asset.ASSET_MATERIAL);
            this.redMaterial = context.assets.find('target_red', pc.asset.ASSET_MATERIAL);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            this.totalTime += dt;
            this.entity.translate(0, 0.01*Math.cos(this.totalTime), 0.01*Math.sin(this.totalTime));
        },
        
        hit: function () {
            this.entity.model.materialAsset = this.greenMaterial;
        },
        
        reset: function () {
            this.entity.model.materialAsset = this.redMaterial;
        }
    };

    return Target;
});