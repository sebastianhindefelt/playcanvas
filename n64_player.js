pc.script.attribute('player_speed', 'number', 1.0);
pc.script.attribute('player_jump', 'number', 10.0);

pc.script.create('n64_player', function (context) {
    // Creates a new N64_player instance
    var N64_player = function (entity) {
        this.entity = entity;
        
        this.jumping = false;
        this.onGround = false;
    };

    N64_player.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.body = context.root.findByName('body');
            
            this.entity.collision.on('collisionstart', this.onCollisionStart, this);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        },
        
        reset: function() {
            this.entity.setLocalPosition(0, 5, 0);  
            this.entity.rigidbody.syncEntityToBody();
        },
        
        move: function (direction) {
            var rot = Math.atan2(direction.x, direction.z);
            rot = rot * (180/Math.PI);
            
            var q = new pc.Quat();
            q.setFromAxisAngle(pc.Vec3.UP, rot);
            this.body.setLocalRotation(q);
            
            direction.scale(this.player_speed);
            //this.entity.translateLocal(direction);
            
            //this.entity.rigidbody.activate();
            direction.y = this.entity.rigidbody.linearVelocity.y;
            
            this.entity.rigidbody.linearVelocity = direction;
        },
        
        jump: function () {
            
        },
        
        onCollisionStart: function (result) {
            
        }
    };

    return N64_player;
});