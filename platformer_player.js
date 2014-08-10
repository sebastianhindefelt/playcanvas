pc.script.attribute("player_speed", "number", 10);
pc.script.attribute("player_jump", "number", 8);
pc.script.attribute("player_max_speed", "number", 10);

pc.script.create('platformer_player', function (context) {
    
    var origin = new pc.Vec3();
    var groundCheckRay = new pc.Vec3(0, -0.5, 0);
    var rayEnd = new pc.Vec3();
    
    // Creates a new Player instance
    var PlatformerPlayer = function (entity) {
        this.entity = entity;
        
        this.onGround = false;
    };

    PlatformerPlayer.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.entity.rigidbody.angularFactor = pc.Vec3.ZERO;
            this.jumpImpulse = new pc.Vec3(0, this.player_jump, 0);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if(!this.onGround){
                this._checkGround();
            }
        },
        
        move: function (direction) {
            //if(this.onGround) {
                
                //this.entity.rigidbody.activate();
                direction.scale(this.player_speed);
                //this.entity.translateLocal(direction);
                var currVel = this.entity.rigidbody.linearVelocity;
                currVel.add(direction);
                
                
                currVel.x = Math.max(-this.player_max_speed, Math.min(currVel.x, this.player_max_speed));
                this.entity.rigidbody.linearVelocity = currVel;
            //}
        },
        
        jump: function () {
            
            if(this.onGround){
              this.entity.rigidbody.activate();
              this.entity.rigidbody.applyImpulse(this.jumpImpulse, origin);
              this.onGround = false;
            }
        },
        
        reset: function () {
            this.entity.setPosition(0, 2, 0);
            this.entity.rigidbody.syncEntityToBody();
            this.entity.rigidbody.linearVelocity = pc.Vec3.ZERO;
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

    return PlatformerPlayer;
});