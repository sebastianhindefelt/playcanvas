pc.script.create('tower', function (context) {
    // Creates a new Tower instance
    var Tower = function (entity) {
        this.entity = entity;
    };

    Tower.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            //this.entity.rotateLocal(0, dt*20, 0);
        }
    };

    return Tower;
});