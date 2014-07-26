pc.script.attribute("materials", "asset", [], {type: "material"});

pc.script.create('terrain', function (context) {
    // Creates a new Terrain instance
    var Terrain = function (entity) {
        this.entity = entity;
    };

    Terrain.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
           
            this.randomTerrain(0,0);
        },
        
        randomTerrain: function (offsetx, offsetz) {
            var format = new pc.gfx.VertexFormat(context.graphicsDevice, [
                { semantic: pc.gfx.SEMANTIC_POSITION, components: 3, type: pc.gfx.ELEMENTTYPE_FLOAT32 },
                { semantic: pc.gfx.SEMANTIC_NORMAL, components: 3, type: pc.gfx.ELEMENTTYPE_FLOAT32 }
            ]);
            
            var xs = 64;
            var zs = 64;
            var numVertices = xs*zs;
            var vertexBuffer = new pc.gfx.VertexBuffer(context.graphicsDevice, format, numVertices, pc.gfx.BUFFER_STATIC);
            
            
            var vertices = [];
            
            for (z = 0; z < zs; z++) {
                for (x = 0; x < xs; x++) {
                    y = pc.math.random(0, 1);
                    vertices.push(new pc.Vec3(x+offsetx, y, -z-offsetz));
                }
            }
            
            
            /*
            for (z = 0; z < zs; z++) {
                for (x = 0; x < xs; x++) {
                    y = pc.math.random(0, 1);
                    iterator.element[pc.gfx.SEMANTIC_POSITION].set(x+offsetx, y, -z-offsetz);
                    xn = pc.math.random(0, 1);
                    yn = pc.math.random(0.5, 1);
                    zn = pc.math.random(0, 1);
                    
                    n = new pc.Vec3(xn, yn, zn);
                    n.normalize();
                    iterator.element[pc.gfx.SEMANTIC_NORMAL].set(n.x, n.y, n.z);
                    iterator.next();
                    
                }
            }
            
            iterator.end();
            
            */

            var indices = [];
            
            for(z = 0; z < (zs-1); z++) {
                for(x = 0; x < (xs-1); x++){
                    var i = x + z*zs;
                    indices.push(i);
                    indices.push(i + 1 + zs);
                    indices.push(i + zs);
                    
                    indices.push(i);
                    indices.push(i + 1);
                    indices.push(i + 1 + zs);
                }
            }
            
            var faceNormals = []
            for(i = 0; i < indices.length; i+=3){
                var a = vertices[indices[i]];
                var b = vertices[indices[i+1]];
                var c = vertices[indices[i+2]];
                var e1 = new pc.Vec3();
                //console.log('b: '+b);
                //console.log('a: '+a);
                
                e1.sub2(b, a);
                //console.log('e1: '+e1);
                
                var e2 = new pc.Vec3();
                e2.sub2(c, a);
                //console.log('c: '+c);
                //console.log('a: '+a);
                //console.log('e2: '+e2);
                var n = new pc.Vec3();
                n.cross(e2, e1);
                if(n.y < 0){
                    n.cross(e1, e2);
                }
                faceNormals.push(n);
            }
            
            
            var normals = [];
            var rowlen = (zs-1)*2;
            for (z = 0; z < zs; z++) {
                for (x = 0; x < xs; x++) {
                    if(z === 0 || z === (zs-1) || x === 0 || x === (xs-1)){
                        // TODO: calculate edge cases
                        normals.push(new pc.Vec3(0,1,0));
                        continue;
                    }
                    var nsum = new pc.Vec3();
                    var lower = (x-1)*2+(z-1)*rowlen;
                    nsum.add(faceNormals[lower]);
                    nsum.add(faceNormals[lower+1]);
                    nsum.add(faceNormals[lower+2]);
                    var upper = (x-1)*2+1+z*rowlen;
                    nsum.add(faceNormals[upper]);
                    nsum.add(faceNormals[upper+1]);
                    nsum.add(faceNormals[upper+2]);
                    
                    nsum.scale(1/6);
                    nsum.normalize();
                    normals.push(nsum);
                }
            }
            
            var iterator = new pc.gfx.VertexIterator(vertexBuffer);
            for(i = 0; i < vertices.length; i++){
                
                iterator.element[pc.gfx.SEMANTIC_POSITION].set(vertices[i].x, vertices[i].y, vertices[i].z);
                iterator.element[pc.gfx.SEMANTIC_NORMAL].set(normals[i].x, normals[i].y, normals[i].z);
                iterator.next();
            }
            
            iterator.end();
            

            // Create an index buffer
            var indexBuffer = new pc.gfx.IndexBuffer(context.graphicsDevice, pc.gfx.INDEXFORMAT_UINT16, indices.length, pc.gfx.BUFFER_STATIC);
            
            // Fill the index buffer
            var dst = new Uint16Array(indexBuffer.lock());
            dst.set(indices);
            indexBuffer.unlock();
            
            var mesh = new pc.scene.Mesh();
            mesh.vertexBuffer = vertexBuffer;
            mesh.indexBuffer[0] = indexBuffer;
            mesh.primitive[0].type = pc.gfx.PRIMITIVE_TRIANGLES;
            mesh.primitive[0].base = 0;
            mesh.primitive[0].count = indices.length;
            mesh.primitive[0].indexed = true;
            
            var node = new pc.scene.GraphNode();
            var material = new pc.scene.PhongMaterial();
            material.diffuse.set(0.0, 0.7, 0.0);
            material.ambient.set(0.5, 0.5, 0.5);
            material.update();
            
            var meshInstance = new pc.scene.MeshInstance(node, mesh, material);
            var model = new pc.scene.Model();
            model.graph = node;
            model.meshInstances = [ meshInstance ];
            this.entity.addChild(node);
            context.scene.addModel(model);
        },
        
        randomSlabs: function () {
            var format = new pc.gfx.VertexFormat(context.graphicsDevice, [
                { semantic: pc.gfx.SEMANTIC_POSITION, components: 3, type: pc.gfx.ELEMENTTYPE_FLOAT32 },
                { semantic: pc.gfx.SEMANTIC_NORMAL, components: 3, type: pc.gfx.ELEMENTTYPE_FLOAT32 }
            ]);
            
            var xs = 200;
            var zs = 200;
            var numVertices = xs*zs*6;
            var vertexBuffer = new pc.gfx.VertexBuffer(context.graphicsDevice, format, numVertices, pc.gfx.BUFFER_STATIC);
            var iterator = new pc.gfx.VertexIterator(vertexBuffer);
            
            for (z = 0; z < zs; z++) {
                for (x = 0; x < xs; x++) {
                    y = pc.math.random(0, 5);
                    iterator.element[pc.gfx.SEMANTIC_POSITION].set(x-0.5, y, -z+0.5);
                    iterator.element[pc.gfx.SEMANTIC_NORMAL].set(0, 1, 0);
                    iterator.next();
                    iterator.element[pc.gfx.SEMANTIC_POSITION].set(x+0.5, y, -z-0.5);
                    iterator.element[pc.gfx.SEMANTIC_NORMAL].set(0, 1, 0);
                    iterator.next();
                    iterator.element[pc.gfx.SEMANTIC_POSITION].set(x-0.5, y, -z-0.5);
                    iterator.element[pc.gfx.SEMANTIC_NORMAL].set(0, 1, 0);
                    iterator.next();
                   
                    iterator.element[pc.gfx.SEMANTIC_POSITION].set(x-0.5, y, -z+0.5);
                    iterator.element[pc.gfx.SEMANTIC_NORMAL].set(0, 1, 0);
                    iterator.next();
                    iterator.element[pc.gfx.SEMANTIC_POSITION].set(x+0.5, y, -z+0.5);
                    iterator.element[pc.gfx.SEMANTIC_NORMAL].set(0, 1, 0);
                    iterator.next();
                    iterator.element[pc.gfx.SEMANTIC_POSITION].set(x+0.5, y, -z-0.5);
                    iterator.element[pc.gfx.SEMANTIC_NORMAL].set(0, 1, 0);
                    iterator.next();
                }
            }
            
            iterator.end();
            
            var mesh = new pc.scene.Mesh();
            mesh.vertexBuffer = vertexBuffer;
            mesh.primitive[0].type = pc.gfx.PRIMITIVE_TRIANGLES;
            mesh.primitive[0].base = 0;
            mesh.primitive[0].count = numVertices;
            mesh.primitive[0].indexed = false;
            
            var node = new pc.scene.GraphNode();
            var material = new pc.scene.PhongMaterial();
            
            var meshInstance = new pc.scene.MeshInstance(node, mesh, material);
            var model = new pc.scene.Model();
            model.graph = node;
            model.meshInstances = [ meshInstance ];
            this.entity.addChild(node);
            context.scene.addModel(model);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return Terrain;
});