pc.script.attribute("player_speed", "number", 10);
pc.script.attribute("player_jump", "number", 4000);

pc.script.create('player', function (context) {
    
    var origin = new pc.Vec3();
    var groundCheckRay = new pc.Vec3(0, -1, 0);
    var rayEnd = new pc.Vec3();
    
    // Creates a new Player instance
    var Player = function (entity) {
        this.entity = entity;
        
        this.onGround = true;
    };

    Player.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.entity.rigidbody.angularFactor = pc.Vec3.ZERO;
            this.jumpImpulse = new pc.Vec3(0, this.player_jump, 0);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            this._checkGround();
        },
        
        move: function (direction) {
            //console.log('trying to move!');
            if(this.onGround) {
                this.entity.rigidbody.activate();
                direction.scale(this.player_speed);
                this.entity.rigidbody.linearVelocity = direction;
            }  
        },
        
        jump: function () {
            if(this.onGround){
              this.entity.rigidbody.activate();
              this.entity.rigidbody.applyImpulse(this.jumpImpulse, origin);
              this.onGround = false;
            }
        },
        
        reset: function () {
            this.entity.setPosition(3, 3, -1);
            this.entity.rigidbody.syncEntityToBody();
        },
        
        _checkGround: function() {
            var self = this;
            var pos = this.entity.getPosition();
            rayEnd.add2(pos, groundCheckRay);
            self.onGround = false;
            
            context.systems.rigidbody.raycastFirst(pos, rayEnd, function (result) {
                self.onGround = true;
            });
        }
    };

    return Player;
});