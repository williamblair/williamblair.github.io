class GLTFModel
{
    constructor(filename, scale = 1.0) {
        var request = new XMLHttpRequest();
        request.open("GET", filename, false); // false makes it synchronous
        request.send(null);
        
        if (request.status === 200) {
          this.OnGltfLoad(request.responseText, scale);
        } else {
          console.log("Request failed; request status: ", request.status);
        }
    }
    
    OnGltfLoad(response, scale) {
        //console.log("response: ", response);
        var jsonObj = JSON.parse(response);

        console.log("Mesh0: name: ", jsonObj.meshes[0].name);

        // each attribute is defined by mapping the attribute name to
        // the index of the accessor which contains the attribute data
        //console.log("Mesh0: position accessor: ",
        //    jsonObj.meshes[0].primitives[0].attributes.POSITION);

        var positionAccessor = jsonObj.accessors[
            jsonObj.meshes[0].primitives[0].attributes.POSITION
        ];
        //console.log("Position accessor: ", positionAccessor);
        //console.log("  type: ", positionAccessor.componentType);
        //console.log("  count: ", positionAccessor.count);
        this.vertexCount = positionAccessor.count;
        //if (positionAccessor.componentType === 5126) {
        //    console.log("    type === GL_FLOAT");
        //}
        var positionBufferView = jsonObj.bufferViews[
            positionAccessor.bufferView
        ];
        //console.log("Position buffer view: ", positionBufferView);
        var positionBuffer = jsonObj.buffers[positionBufferView.buffer];
        //console.log("Position buffer: ", positionBuffer);

        // https://gist.github.com/sketchpunk/f5fa58a56dcfe6168a9328e7c32a4fd4
        var stringStartIndex = "data:application/octet-stream;base64,".length;
        var base64Str = positionBuffer.uri.substring(stringStartIndex);
        var blob = window.atob(base64Str);
        var fLen = blob.length / Float32Array.BYTES_PER_ELEMENT;
        var dView = new DataView(new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT));
        this.vertices = new Float32Array(fLen);
        var p = 0;
        for (var j = 0; j < fLen; ++j) {
            p = j * 4;
            dView.setUint8(0,blob.charCodeAt(p));
            dView.setUint8(1,blob.charCodeAt(p+1));
            dView.setUint8(2,blob.charCodeAt(p+2));
            dView.setUint8(3,blob.charCodeAt(p+3));
            this.vertices[j] = dView.getFloat32(0,true) * scale;
        }
        
        var normalAccessor = jsonObj.accessors[
            jsonObj.meshes[0].primitives[0].attributes.NORMAL
        ];
        var normalBufferView = jsonObj.bufferViews[
            normalAccessor.bufferView
        ];
        console.log("Normal accessor: ", normalAccessor);
        var normalBuffer = jsonObj.buffers[normalBufferView.buffer];
        console.log("normal buffer: ", normalBuffer);
        stringStartIndex = "data:application/octet-stream;base64,".length;
        base64Str = normalBuffer.uri.substring(stringStartIndex);
        blob = window.atob(base64Str);
        fLen = blob.length / Float32Array.BYTES_PER_ELEMENT;
        dView = new DataView(new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT));
        this.normals = new Float32Array(fLen);
        p = 0;
        for (var j = 0; j < fLen; ++j) {
            p = j * 4;
            dView.setUint8(0,blob.charCodeAt(p));
            dView.setUint8(1,blob.charCodeAt(p+1));
            dView.setUint8(2,blob.charCodeAt(p+2));
            dView.setUint8(3,blob.charCodeAt(p+3));
            this.normals[j] = dView.getFloat32(0,true);
        }
        console.log("normals: ", this.normals);
    }
    
    InitBuffers(gl)
    {
        // number of element indices to draw
        this.n = this.vertexCount;
    
        // create the buffer object
        this.vertexBuffer = gl.createBuffer();
        this.normalBuffer = gl.createBuffer();
        //this.indexBuffer = gl.createBuffer();
        if (!this.vertexBuffer || /*!this.indexBuffer || */!this.normalBuffer) {
            console.log("Failed to create vertex buffer or normal buffer for GLTF");
            return -1;
        }
        
        // bind the buffer object that we are currently referring to
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // send data to the buffer
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        // send data to the buffer
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
    }
    
    Draw(gl)
    {
        // bind the buffer object that we are currently referring to
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        
        // Get vertex attribute
        var aPosition = gl.getAttribLocation(gShader.program, "aPosition");
        if (aPosition < 0) {
            console.log("Failed to get aPosition attribute");
            return -1;
        }
        
        this.floatsPerVertex = 3;
        // tell opengl about the data we just sent it
        gl.vertexAttribPointer(aPosition,   // the attribute location
                               this.floatsPerVertex,          // number of points per vertex (x,y,z)
                               gl.FLOAT,   // vertex data type
                               false,      // does the data need normalization?
                               0, // how many bytes to move to the next vertex (0 for default)
                               0);         // first vertex entry offset
        // give opengl the OK to use these properties for this attribute
        gl.enableVertexAttribArray(aPosition);
        
        // Get normal attribute
        var aNormal = gl.getAttribLocation(gShader.program, "aNormal");
        if (aNormal < 0) {
            console.log("Failed to get aNormal attribute");
            return -1;
        }
        
        //this.floatsPerVertex = 3;
        // tell opengl about the data we just sent it
        gl.vertexAttribPointer(aNormal,   // the attribute location
                               this.floatsPerVertex,          // number of points per vertex (x,y,z)
                               gl.FLOAT,   // vertex data type
                               false,      // does the data need normalization?
                               0, // how many bytes to move to the next vertex (0 for default)
                               0);         // first vertex entry offset
        // give opengl the OK to use these properties for this attribute
        gl.enableVertexAttribArray(aNormal);
        
        // draw the triangles
        gl.drawArrays(gl.TRIANGLES, 0, this.n);
    }
}
