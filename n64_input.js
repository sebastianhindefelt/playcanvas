pc.script.create('n64_input', function (context) {
    
    // Creates a new Input instance
    var N64_input = function (entity) {
        this.entity = entity;
        
        this.x = new pc.Vec3();
        this.z = new pc.Vec3();
        
        this.heading = new pc.Vec3();
        
        var element = document.getElementById('application-container');
        this.controller = new pc.input.Controller(element);
        this.gamepads = new pc.input.GamePads();
        
        this.controller.registerPadButton('jump', [pc.input.PAD_1], [pc.input.PAD_FACE_1]);
        
        context.mouse.disableContextMenu();
        context.mouse.on(pc.input.EVENT_MOUSEDOWN, this.onMouseDown, this);
    };

    N64_input.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.camera = context.root.findByName('playercamera');
            this.cameraController = 'n64_camera';
            
            this.character = this.entity;
            this.characterController = 'n64_player';
            
            
        },
        
        reset: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            this.gamepads.update(dt);
            var input = false;
            
            
            this.heading.set(0, 0, 0);
            
            var heading_x = this.gamepads.getAxis(pc.input.PAD_1, pc.input.PAD_L_STICK_X);
            var heading_y = this.gamepads.getAxis(pc.input.PAD_1, pc.input.PAD_L_STICK_Y);
            this.heading.set(heading_x, 0, heading_y);
            
        
            if(this.heading.length() > 0.1)
                this.heading.normalize();
                
                
            this.character.script.send(this.characterController, 'move', this.heading);
            
            
            if(this.gamepads.isPressed(pc.input.PAD_1, pc.input.PAD_FACE_1)){
                console.log('other!!')
            }
            
            if(this.gamepads.isPressed(pc.input.PAD_1, pc.input.PAD_START)){
                console.log('pressed reset');
                this.character.script.send(this.characterController, 'reset');
            }

            

        },
        
        onMouseDown: function (event) {
            if(!pc.input.Mouse.isPointerLocked()) {
                context.mouse.enablePointerLock();
            }
        }
    };

    return N64_input;
});