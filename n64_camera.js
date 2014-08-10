pc.script.create('n64_camera', function (context) {
    // Creates a new N64_camera instance
    var N64_camera = function (entity) {
        this.entity = entity;
    };

    N64_camera.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.player = context.root.findByName('player');
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            this.entity.lookAt(this.player.getPosition());
        }
    };

    return N64_camera;
});