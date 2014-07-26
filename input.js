pc.script.attribute('shoot_range', 'number', 10);
pc.script.attribute("mouse_sensitivity", "number", 5.0)

pc.script.create('input', function (context) {
    
    // Creates a new Input instance
    var Input = function (entity) {
        this.entity = entity;
        
        this.x = new pc.Vec3();
        this.z = new pc.Vec3();
        
        this.ex = 0;
        this.ey = 0;
        
        this.heading = new pc.Vec3();
        
        var element = document.getElementById('application-container');
        this.controller = new pc.input.Controller(element);
        
        this.controller.registerKeys('forward', [pc.input.KEY_W]);
        this.controller.registerKeys('back', [pc.input.KEY_S]);
        this.controller.registerKeys('left', [pc.input.KEY_A]);
        this.controller.registerKeys('right', [pc.input.KEY_D]);
        this.controller.registerKeys('jump', [pc.input.KEY_SPACE]);
        this.controller.registerKeys('reset', [pc.input.KEY_R]);
        this.controller.registerMouse('shoot', [pc.input.MOUSEBUTTON_LEFT])
        
        context.mouse.disableContextMenu();
        context.mouse.on(pc.input.EVENT_MOUSEDOWN, this.onMouseDown, this);
        context.mouse.on(pc.input.EVENT_MOUSEMOVE, this.onMouseMove, this);
    };

    Input.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.camera = context.root.findByName('playercamera');
            this.cameraController = 'camera';
            
            this.character = this.entity;
            this.characterController = 'player';
            
            this.target = context.root.findByName('target');
            this.targetController = 'target';
        },
        
        reset: function () {
             this.target.script.send(this.targetController, 'reset');
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            var input = false;
            
            var transform = this.camera.getWorldTransform();
            
            this.z = transform.getZ();
            this.z.normalize();
            this.z.y = 0;
            
            this.x = transform.getX();
            this.x.normalize();
            this.x.y = 0;
            
            this.heading.set(0, 0, 0);
            
            if (this.controller.isPressed('left')){
                this.heading.sub(this.x);
                input = true;
            } else if (this.controller.isPressed('right')){
                this.heading.add(this.x);
                input = true;
            } 
            
            if (this.controller.isPressed('forward')){
                this.heading.sub(this.z);
                input = true;
            } else if (this.controller.isPressed('back')){
                this.heading.add(this.z);
                input = true;
            }
            
            if (input) {
                this.heading.normalize();
            }
            
            this.character.script.send(this.characterController, 'move', this.heading);
            
            if(this.controller.wasPressed('jump')) {
                this.character.script.send(this.characterController, 'jump');
            }
            
            if(this.controller.wasPressed('reset')){
                this.character.script.send(this.characterController, 'reset');
                this.reset();
            }
            
            if(this.controller.wasPressed('shoot')) {
                var pos = this.camera.getPosition();
                
                var z = transform.getZ();
                z.normalize();
                
                var rayEnd = pos.clone();
                rayEnd.sub(z.scale(this.shoot_range));
                
                var target = this.target;
                var targetController = this.targetController;
                var mat = this.greenMaterial;
                
                context.systems.rigidbody.raycastFirst(pos, rayEnd, function (result) {
                    if(result.entity === target) {
                        target.script.send(targetController, 'hit');
                    }
                });
                
                this.entity.audiosource.play("laser");
            }
            
            // TODO: should this call be first in update or last?
            this.controller.update(dt);

        },
        
        onMouseMove: function (event) {
            if(!pc.input.Mouse.isPointerLocked()) {
                return;
            }
            this.ex -= event.dy / this.mouse_sensitivity;
            this.ex = pc.math.clamp(this.ex, -90, 90);
            this.ey -= event.dx / this.mouse_sensitivity;
            
            this.camera.script.send(this.cameraController, 'setAngles', this.ex, this.ey);
        },
        
        onMouseDown: function (event) {
            if(!pc.input.Mouse.isPointerLocked()) {
                context.mouse.enablePointerLock();
            }
        }
    };

    return Input;
});