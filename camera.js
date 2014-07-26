pc.script.create('camera', function (context) {
    // Creates a new Camera instance
    var Camera = function (entity) {
        this.entity = entity;
        
        this.ex = 0;
        this.ey = 0;
    };

    Camera.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            this.entity.setEulerAngles(this.ex, this.ey, 0);
        },
        
        setAngles: function(ex, ey) {
            this.ex = ex;
            this.ey = ey;
        }
    };

    return Camera;
});