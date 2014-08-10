pc.script.attribute("materials", "asset", [], {type: "material"});
pc.script.attribute("textures", "asset", [], {type: "texture"});

pc.script.create('terrain', function (context) {
    // Creates a new Terrain instance
    var Terrain = function (entity) {
        this.entity = entity;
    };

    Terrain.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            PerlinNoise = new function() {

            this.noise = function(x, y, z) {
            
               var p = new Array(512);
               var permutation = [ 151,160,137,91,90,15,
               131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
               190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
               88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
               77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
               102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
               135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
               5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
               223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
               129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
               251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
               49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
               138,236,205,93,222,114,67,+29,24,72,243,141,128,195,78,66,215,61,156,180
               ];
               for (var i=0; i < 256 ; i++) 
             p[256+i] = p[i] = permutation[i]; 
            
                  var X = Math.floor(x) & 255,                  // FIND UNIT CUBE THAT
                      Y = Math.floor(y) & 255,                  // CONTAINS POINT.
                      Z = Math.floor(z) & 255;
                  x -= Math.floor(x);                                // FIND RELATIVE X,Y,Z
                  y -= Math.floor(y);                                // OF POINT IN CUBE.
                  z -= Math.floor(z);
                  var    u = fade(x),                                // COMPUTE FADE CURVES
                         v = fade(y),                                // FOR EACH OF X,Y,Z.
                         w = fade(z);
                  var A = p[X  ]+Y, AA = p[A]+Z, AB = p[A+1]+Z,      // HASH COORDINATES OF
                      B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;      // THE 8 CUBE CORNERS,
            
                  return scale(lerp(w, lerp(v, lerp(u, grad(p[AA  ], x  , y  , z   ),  // AND ADD
                                                 grad(p[BA  ], x-1, y  , z   )), // BLENDED
                                         lerp(u, grad(p[AB  ], x  , y-1, z   ),  // RESULTS
                                                 grad(p[BB  ], x-1, y-1, z   ))),// FROM  8
                                 lerp(v, lerp(u, grad(p[AA+1], x  , y  , z-1 ),  // CORNERS
                                                 grad(p[BA+1], x-1, y  , z-1 )), // OF CUBE
                                         lerp(u, grad(p[AB+1], x  , y-1, z-1 ),
                                                 grad(p[BB+1], x-1, y-1, z-1 )))));
               };
               function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
               function lerp( t, a, b) { return a + t * (b - a); }
               function grad(hash, x, y, z) {
                  var h = hash & 15;                      // CONVERT LO 4 BITS OF HASH CODE
                  var u = h<8 ? x : y,                 // INTO 12 GRADIENT DIRECTIONS.
                         v = h<4 ? y : h==12||h==14 ? x : z;
                  return ((h&1) === 0 ? u : -u) + ((h&2) === 0 ? v : -v);
               } 
               function scale(n) { return (1 + n)/2; }
            };
            var xs = 64;
            var zs = 64;
            var maxHeight = 20.0;
            
            var heightMap = [];
            for(z = 0; z < zs; z++){
                for(x = 0; x <  xs; x++){
                    var nx = x / xs;
                    var nz = z / zs;
                    heightMap.push(PerlinNoise.noise(nx, nz, 25.0));
                }
            }
      
            
            var vertices = this.terrainFromHeightMap(xs, zs, 0, 0, maxHeight, heightMap);
            
            this.generateTerrain(xs, zs, vertices);
            
            heightMap = [];
            for(z = 0; z < zs; z++){
                for(x = 63; x <  xs*2-1; x++){
                    nx = x / xs;
                    nz = z / zs;
                    heightMap.push(PerlinNoise.noise(nx, nz, 25.0));
                }
            }
            vertices = this.terrainFromHeightMap(xs, zs, 63, 0, maxHeight, heightMap);
            
            this.generateTerrain(xs, zs, vertices);
        },
        
        terrainFromHeightMap: function (xs, zs, ox, oz, maxHeight, heightMap) {
            var vertices = [];
            
            for (z = 0; z < zs; z++) {
                for (x = 0; x < xs; x++) {
                    y = heightMap[x + z*zs];
                    vertices.push(new pc.Vec3(x+ox, y*maxHeight, -z-oz));
                }
            }
            return vertices;
        },
        
        randomTerrain: function (xs, zs) {
            var vertices = [];
            
            for (z = 0; z < zs; z++) {
                for (x = 0; x < xs; x++) {
                    y = pc.math.random(0, 1);
                    vertices.push(new pc.Vec3(x, y, -z));
                }
            }
            return vertices;
        },
        
        generateTerrain: function (xs, zs, vertices) {
            var format = new pc.gfx.VertexFormat(context.graphicsDevice, [
                { semantic: pc.gfx.SEMANTIC_POSITION, components: 3, type: pc.gfx.ELEMENTTYPE_FLOAT32 },
                { semantic: pc.gfx.SEMANTIC_NORMAL, components: 3, type: pc.gfx.ELEMENTTYPE_FLOAT32 },
                { semantic: pc.gfx.SEMANTIC_COLOR, components: 4, type: pc.gfx.ELEMENTTYPE_FLOAT32 }
            ]);

            var numVertices = xs*zs;
            var vertexBuffer = new pc.gfx.VertexBuffer(context.graphicsDevice, format, numVertices, pc.gfx.BUFFER_STATIC);

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
                e1.sub2(b, a);
                
                var e2 = new pc.Vec3();
                e2.sub2(c, a);
                
                var n = new pc.Vec3();
                n.cross(e1, e2);
                //TODO: check normal direction maybe? if the cross product should be done the other way??!
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
                iterator.element[pc.gfx.SEMANTIC_COLOR].set(1.0, 0.0, 0.0, 1.0);
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
            //material.diffuse.set(0.0, 0.7, 0.0);
            //material.ambient.set(0.5, 0.5, 0.5);
            material.diffuse.set(pc.math.random(0, 1), pc.math.random(0, 1), pc.math.random(0, 1));
            material.ambient.set(pc.math.random(0, 1), pc.math.random(0, 1), pc.math.random(0, 1));
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