var Primitives = {};

Primitives.GridAxis = class {

    static createModel(gl, incAxis) {
        return new Model(Primitives.GridAxis.createMesh(gl, incAxis));
    }

    static createMesh(gl, incAxis) {
        var verts = [];
        const size = 1.8; // width/height of the outer box of the grid
        const div = 10.0; // how many times to divide up grid
        const step = size / div; // steps between each line
        const half = size / 2; // from origin the starting position is half of the size

        var p;
        for (var i=0; i <= div; ++i) {
            // vertical line
            p = -half + (i*step);
            verts.push(p); // x,y,z
            verts.push(0);
            verts.push(half);
            verts.push(0); // color

            verts.push(p); // x,y,z
            verts.push(0);
            verts.push(-half);
            verts.push(0); // color

            // horizontal line
            p = half - (i*step);
            verts.push(-half);
            verts.push(0);
            verts.push(p);
            verts.push(0);

            verts.push(half);
            verts.push(0);
            verts.push(p);
            verts.push(0);

        }

        if (incAxis) {
            // x axis
            verts.push(-1.1);
            verts.push(0);
            verts.push(0);
            verts.push(1);

            verts.push(1.1);
            verts.push(0);
            verts.push(0);
            verts.push(1);

            // y axis
            verts.push(0);
            verts.push(-1.1);
            verts.push(0);
            verts.push(2);

            verts.push(0);
            verts.push(1.1);
            verts.push(0);
            verts.push(2);

            // z axis
            verts.push(0);
            verts.push(0);
            verts.push(-1.1);
            verts.push(3);

            verts.push(0);
            verts.push(0);
            verts.push(1.1);
            verts.push(3);
        }

        const attrColorLoc = 4; // shader attrib loc
        var mesh = { drawMode: gl.LINES, vao: gl.createVertexArray() };

        // calculate sizes
        mesh.vertexComponentLen = 4;
        mesh.vertexCount = verts.length / mesh.vertexComponentLen;
        var strideLen = Float32Array.BYTES_PER_ELEMENT * mesh.vertexComponentLen;

        // setup buffer
        mesh.bufVertices = gl.createBuffer();
        gl.bindVertexArray(mesh.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.bufVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(ATTR_POSITION_LOC);
        gl.enableVertexAttribArray(attrColorLoc);

        gl.vertexAttribPointer(ATTR_POSITION_LOC, 3, gl.FLOAT, false, strideLen, 0);
        gl.vertexAttribPointer(attrColorLoc, 1, gl.FLOAT, false, strideLen, Float32Array.BYTES_PER_ELEMENT * 3);

        // cleanup
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.mMeshCache["grid"] = mesh;
        return mesh;
    }
};

Primitives.Quad = class {
    static createModel(gl) {
        return new Model(Primitives.Quad.createMesh(gl));
    }

    static createMesh(gl) {
        const vertices = [ 
          -0.5, 0.5, 0,
          -0.5, -0.5, 0,
          0.5, -0.5, 0,
          0.5, 0.5, 0
        ];
        const uv = [
          0, 0,
          0, 1,
          1, 1,
          1, 0
        ];
        const indices = [
          0, 1, 2,
          2, 3, 0
        ];

        var mesh = gl.fCreateMeshVAO("Quad", indices, vertices, null, uv);
        mesh.noCulling = true;
        mesh.doBlending = true;
        return mesh;
    }
};

Primitives.MultiQuad = class {
    static createModel(gl) {
        return new Model(Primitives.MultiQuad.createMesh(gl));
    }
    static createMesh(gl) {
        var indices = [];
        var uv = [];
        var vertices = [];

        for (var i=0; i<10; ++i)
        {
            var size = 0.2 + (0.8 * Math.random());
            var half = size * 0.5;
            var angle = Math.PI * 2 * Math.random();
            var dx = half * Math.cos(angle);
            var dy = half * Math.sin(angle);
            var x = -2.5 + (Math.random() * 5);
            var y = -2.5 + (Math.random() * 5);
            var z = 2.5 - (Math.random()*5);
            var p = i * 4;

            vertices.push(x-dx, y+half, z-dy);
            vertices.push(x-dx, y-half, z-dy);
            vertices.push(x+dx, y-half, z+dy);
            vertices.push(x+dx, y+half, z+dy);

            uv.push(0,0, 0,1, 1,1, 1,0);
            indices.push(p, p+1, p+2, p+2, p+3, p);
        }

        var mesh = gl.fCreateMeshVAO("MultiQuad", indices, vertices, null, uv);
        mesh.noCulling = true;
        mesh.doBlending = true;
        return mesh;
    }
}

Primitives.Cube = class {
    static createModel(gl, name) { return new Model(Primitives.Cube.createMesh(gl, name||"Cube", 1,1,1, 0,0,0)); }
    static createMesh(gl, name, width, height, depth, x, y, z) {
        var w = width*0.5
        var h = height*0.5
        var d = depth*0.5;
        var x0 = x-w;
        var x1 = x+w;
        var y0 = y-h;
        var y1 = y+h;
        var z0 = z-d;
        var z1 = z+d;

        // starting from bottom left corner, then work counter clockwise
        var vertices = [
            x0, y1, z1, 0,    //0 Front
            x0, y0, z1, 0,    //1
            x1, y0, z1, 0,    //2
            x1, y1, z1, 0,    //3 

            x1, y1, z0, 1,    //4 Back
            x1, y0, z0, 1,    //5
            x0, y0, z0, 1,    //6
            x0, y1, z0, 1,    //7 

            x0, y1, z0, 2,    //7 Left
            x0, y0, z0, 2,    //6
            x0, y0, z1, 2,    //1
            x0, y1, z1, 2,    //0

            x0, y0, z1, 3,    //1 Bottom
            x0, y0, z0, 3,    //6
            x1, y0, z0, 3,    //5
            x1, y0, z1, 3,    //2

            x1, y1, z1, 4,    //3 Right
            x1, y0, z1, 4,    //2 
            x1, y0, z0, 4,    //5
            x1, y1, z0, 4,    //4

            x0, y1, z0, 5,    //7 Top
            x0, y1, z1, 5,    //0
            x1, y1, z1, 5,    //3
            x1, y1, z0, 5    //4 
        ];

        var indices = [];
        for (var i = 0; i < vertices.length / 4; i += 2) {
            indices.push(i, i+1, (Math.floor(i/4)*4)+((i+2)%4));
        }

        var UVs = [];
        for (var i = 0; i < 6; ++i) {
            UVs.push(0,0, 0,1, 1,1, 1,0);
        }

        var normals = [
            0, 0, 1,     0, 0, 1,     0, 0, 1,     0, 0, 1,        //Front
             0, 0,-1,     0, 0,-1,     0, 0,-1,     0, 0,-1,        //Back
            -1, 0, 0,    -1, 0, 0,    -1, 0,0 ,    -1, 0, 0,        //Left
             0,-1, 0,     0,-1, 0,     0,-1, 0,     0,-1, 0,        //Bottom
             1, 0, 0,     1, 0, 0,     1, 0, 0,     1, 0, 0,        //Right
             0, 1, 0,     0, 1, 0,     0, 1, 0,     0, 1, 0        //Top
        ];

        var mesh = gl.fCreateMeshVAO(name, indices, vertices, normals, UVs, 4);
        mesh.noCulling = true;
        return mesh;
    }
}



