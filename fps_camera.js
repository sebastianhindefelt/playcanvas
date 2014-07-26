pc.script.attribute("mouse_sensitivity", "number", 5.0);
pc.script.attribute("camera_speed", "number", 5.0);

pc.script.create('fps_camera', function (context) {
    
    // Creates a new Input instance
    var Input = function (entity) {
        this.entity = entity;
        
        this.x = new pc.Vec3();
        this.z = new pc.Vec3();
        
        this.ex = -29;
        this.ey = 0;
        
        this.heading = new pc.Vec3();
        
        var element = document.getElementById('application-container');
        this.controller = new pc.input.Controller(element);
        
        this.controller.registerKeys('forward', [pc.input.KEY_W]);
        this.controller.registerKeys('back', [pc.input.KEY_S]);
        this.controller.registerKeys('left', [pc.input.KEY_A]);
        this.controller.registerKeys('right', [pc.input.KEY_D]);
        this.controller.registerKeys('up', [pc.input.KEY_SPACE]);
        
        context.mouse.disableContextMenu();
        context.mouse.on(pc.input.EVENT_MOUSEDOWN, this.onMouseDown, this);
        context.mouse.on(pc.input.EVENT_MOUSEMOVE, this.onMouseMove, this);
    };

    Input.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            this.entity.setEulerAngles(this.ex, this.ey, 0);
            
            var input = false;
            
            var transform = this.entity.getWorldTransform();
            
            this.z = transform.getZ();
            this.z.normalize();
            
            this.x = transform.getX();
            this.x.normalize();
            
            this.y = transform.getY();
            this.y.normalize();
            
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
            
            if(this.controller.isPressed('up')){
                this.heading.add(this.y);
            }
            
            if (input) {
                this.heading.normalize();
            }
            
            this.entity.translate(this.heading.scale(this.camera_speed*dt));
            
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
        },
        
        onMouseDown: function (event) {
            if(!pc.input.Mouse.isPointerLocked()) {
                context.mouse.enablePointerLock();
            }
        }
    };

    return Input;
});