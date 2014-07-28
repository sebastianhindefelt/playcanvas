pc.script.attribute("box_size", "number", 30.0);
pc.script.attribute("materials", "asset", [], {type: "material"});

pc.script.create('procedural_lab_main', function (context) {
    // Creates a new Procedural_lab_main instance
    var Procedural_lab_main = function (entity) {
        this.entity = entity;
        this.entities = [];
        
        var element = document.getElementById('application-container');
        this.controller = new pc.input.Controller(element);
        
        this.controller.registerKeys('progress', [pc.input.KEY_F]);
        this.controller.registerKeys('reset', [pc.input.KEY_R]);
    };
    /*
    var map = [1, 0, 1, 0, 1, 1, 1, 1,
               1, 0, 1, 0, 1, 1, 1, 1,
               1, 0, 1, 0, 1, 1, 1, 1,
               1, 0, 1, 0, 1, 1, 1, 1,
               1, 0, 1, 0, 1, 1, 1, 1,
               1, 0, 1, 0, 1, 1, 1, 1,
               1, 0, 1, 0, 1, 1, 1, 1,
               1, 0, 1, 0, 1, 1, 1, 1];
    */
    
    var START = 2;
    var GOAL = 3;

    Procedural_lab_main.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            
            this.material_list = [];
            
            var redMaterial = context.assets.find('target_red', pc.asset.ASSET_MATERIAL);
            var greenMaterial = context.assets.find('target_green', pc.asset.ASSET_MATERIAL);
            var lightgrayMaterial = context.assets.find('target_lightgray', pc.asset.ASSET_MATERIAL);
            var darkgrayMaterial = context.assets.find('target_darkgray', pc.asset.ASSET_MATERIAL);
            var lightgray2Material = context.assets.find('target_lightgray2', pc.asset.ASSET_MATERIAL);
            var blueMaterial = context.assets.find('target_blue', pc.asset.ASSET_MATERIAL);
            var yellowMaterial = context.assets.find('target_yellow', pc.asset.ASSET_MATERIAL);
            
            this.material_list.push(lightgrayMaterial);
            this.material_list.push(darkgrayMaterial);
            this.material_list.push(greenMaterial);
            this.material_list.push(redMaterial);
            this.material_list.push(lightgray2Material);
            this.material_list.push(blueMaterial);
            this.material_list.push(yellowMaterial);
            
            this.map_width = 32;
            this.map_height = 32;
            
            this.map = this.randomMap(this.map_width, this.map_height);
            
            this.drawMap(this.map_width, this.map_height, this.map);
            this.updateMap(this.map_width, this.map_height, this.map);
            
            var start = this._find_start(this.map);
            
            this.frontier = [];
            this.visited = [];
            this.came_from = new Array(this.map_width * this.map_height);
            this.path_map = new Array(this.map_width * this.map_height);
            
            this.frontier.push(start);
            this.visited.push(start);
            
        },
        
        reset: function(){
            for(var i = 0; i < this.entities.length; i++){
                this.entities[i].destroy();
                this.entities.splice(i, 1);
                i--;
            }
            
            this.map = this.randomMap(this.map_width, this.map_height);
            this.drawMap(this.map_width, this.map_height, this.map);
            this.updateMap(this.map_width, this.map_height, this.map);
            
            var start = this._find_start(this.map);
            
            this.frontier = [];
            this.visited = [];
            
            this.frontier.push(start);
            this.visited.push(start);
            
            this.came_from = new Array(this.map_width * this.map_height);
            this.path_map = new Array(this.map_width * this.map_height);
        },
        
        progressFrontier: function () {
            var current = this.frontier.pop();
            var neighbors = this._get_neighbors(current, this.map, this.map_width, this.map_height);
            
            for(var i = 0; i < neighbors.length; i++){
                var neighbor = neighbors[i];
                if(this.map[neighbor] === GOAL) {
                    
                    this.frontier = [];
                    this.resolvePath(current);
                    return;
                }
                if(this.visited.indexOf(neighbor) === -1){
                    this.frontier.unshift(neighbor);
                    this.visited.push(neighbor);
                    this.came_from[neighbor] = current;
                }
            }
                
            this.updateMap(this.map_width, this.map_height, this.map);
            this.updateProgression(this.frontier, this.visited);
            this.updatePath();
        },
        
        resolvePath: function(current) {
            var path_pos = current;
            this.path_map[path_pos] = 1;
            while(this.map[path_pos] != START){
                path_pos = this.came_from[path_pos];
                this.path_map[path_pos] = 1;
            }
        },
        
        _get_neighbors: function (current, map, width, height){
            var neighbors = [];
            var up = current - width;
            var down = current + width;
            var left = current - 1;
            var right = current + 1;
            
            if(up > 0 && map[up] !== 1) neighbors.push(up);
            if(down < width*height && map[down] !== 1) neighbors.push(down);
            if(Math.floor(current / width) == Math.floor(left/width) && map[left] !== 1) neighbors.push(left);
            if(Math.floor(current / width) == Math.floor(right/width) && map[right] !== 1) neighbors.push(right);
            return neighbors;
        },
        
        _find_start: function (map) {
            var i = 0;
            while(map[i] !== 2){
                i++;    
            }
            return i;
        },
        
        randomMap: function (width, height) {
            var map = [];
            for(var i = 0; i < width; i++){
                for(var j = 0; j < height; j++){
                    var type = pc.math.random(0, 1) < 0.7 ? 0 : 1;
                    map.push(type);
                }
            }
            
            var startPos = Math.floor(pc.math.random(0, width*height));
            map[startPos] = 2;
            do {
                var endPos = Math.floor(pc.math.random(0, width*height));
            } while(endPos == startPos);
            map[endPos] = 3;
            return map;
        },
        
        updatePath: function () {
            for(var i = 0; i < this.path_map.length; i++){
                if(this.path_map[i] == 1 && this.map[i] != START){
                    this.entities[i].model.materialAsset = this.material_list[6];
                }
            }    
        },
       
        updateProgression: function (frontier, visited) {
            
            // don't overwrite the starting point
            for(var i = 1; i < visited.length; i++) {
                this.entities[visited[i]].model.materialAsset = this.material_list[4];
            }
            
            for(i = 0; i < frontier.length; i++) {
                this.entities[frontier[i]].model.materialAsset = this.material_list[5];
            }
        },
        
        updateMap: function(width, height, map){
            for(var i = 0; i < width; i++){
                for(var j = 0; j < height; j++){
                    var index = j + i*width;
                    var type = map[index];
                    var material;
                    switch(type){
                        case 0:
                            material = this.material_list[0];
                            break;
                        case 1:
                            material = this.material_list[1];
                            break;
                        case 2:
                            material = this.material_list[2];
                            break;
                        case 3:
                            material = this.material_list[3];
                            break;
                        default:
                            console.log('we should not be here!!');
                    }
                    
                    
                    this.entities[index].model.materialAsset = material;
                }
            }
        },
       
        drawMap: function (width, height, map) {
            var offset_x = width * this.box_size / 2;
            var offset_y = height * this.box_size / 2;
            
            for(var i = 0; i < width; i++){
                for(var j = 0; j < height; j++){
                    var entity = new pc.fw.Entity();
                    
                    var material;
                    switch(map[i + j*width]){
                        case 0:
                            material = this.material_list[0];
                            break;
                        case 1:
                            material = this.material_list[1];
                            break;
                        case 2:
                            material = this.material_list[2];
                            break;
                        case 3:
                            material = this.material_list[3];
                            break;
                        default:
                            console.log('we should not be here!!');
                    }
                    
                    context.systems.model.addComponent(entity, {
                        type: 'box',
                        materialAsset: material
                    });
                    
                    entity.setLocalPosition(i * this.box_size - offset_x, 0, j * this.box_size - offset_y);
                    entity.setLocalScale(this.box_size, 1, this.box_size);
                    
                    context.root.addChild(entity);
                    
                    this.entities.push(entity);
                }
            }
        },
        
        

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if(this.controller.isPressed('progress')) {
                this.progressFrontier();
            }
            if(this.controller.wasPressed('reset')) {
                this.reset();
            }
            
            this.controller.update(dt);
        }
    };

    return Procedural_lab_main;
});