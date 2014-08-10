pc.script.attribute("gravity", "number", -1);




pc.script.create('platformer_main', function (context) {
    // Creates a new Platformer_main instance
    var Platformer_main = function (entity) {
        this.entity = entity;
        
    };

    Platformer_main.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            //context.systems.rigidbody.setGravity(0, this.gravity, 0);
            //context.systems.rigidbody.setGravity(0, 0, 0);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return Platformer_main;
});