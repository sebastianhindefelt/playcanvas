pc.script.create('mainlight', function (context) {
    // Creates a new Mainlight instance
    var Mainlight = function (entity) {
        this.entity = entity;
    };

    Mainlight.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            //this.entity.rotate(0, dt*50, 0);
        }
    };

    return Mainlight;
});