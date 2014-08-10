pc.script.create('input', function (context) {
    
    // Creates a new Input instance
    var Input = function (entity) {
        this.entity = entity;
        
        this.x = new pc.Vec3();
        this.z = new pc.Vec3();
        
        this.heading = new pc.Vec3();
        
        var element = document.getElementById('application-container');
        this.controller = new pc.input.Controller(element);
        
        this.controller.registerKeys('left', [pc.input.KEY_A]);
        this.controller.registerKeys('right', [pc.input.KEY_D]);
        this.controller.registerKeys('jump', [pc.input.KEY_SPACE]);
        this.controller.registerKeys('reset', [pc.input.KEY_R]);
        
        context.mouse.disableContextMenu();
        context.mouse.on(pc.input.EVENT_MOUSEDOWN, this.onMouseDown, this);
    };

    Input.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.camera = context.root.findByName('playercamera');
            this.cameraController = 'camera';
            
            this.character = this.entity;
            this.characterController = 'platformer_player';
        },
        
        reset: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            var input = false;
            
            var transform = this.camera.getWorldTransform();
            
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
            
            // TODO: should this call be first in update or last?
            this.controller.update(dt);

        },
        
        onMouseDown: function (event) {
            if(!pc.input.Mouse.isPointerLocked()) {
                context.mouse.enablePointerLock();
            }
        }
    };

    return Input;
});