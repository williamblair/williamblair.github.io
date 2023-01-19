class OBJModel
{
    constructor(objStr, scale = 1.0)
    {
        this.floatsPerVertex = 0;
        this.vertices = [];
        this.vertexIndices = [];
        this.floatsPerNormal = 0;
        this.normals = [];
        this.normalIndices = [];
        this.scale = scale;
        
        var lines = objStr.split(/\r?\n/);
        var curObj = this; // temporary this reference saver
        lines.forEach(function(line, index) {
            if (line.length <= 0 ||
                line[0] == '#') {
                return;
            }
            
            var words = line.split(' ');
            
            if (words.length <= 0) {
                return;
            }
            
            // vertex
            if (words[0] === "v") {
                //console.log(" Vertex!");
                curObj.HandleVertex(words);
            }
            // normal
            else if (words[0] === "vn") {
                curObj.HandleNormal(words);
            }
            // face
            else if (words[0] === "f") {
                curObj.HandleFace(words);
            }
        });
        
        // reorder normals so their indices match the vertexIndices
        this.ReorderNormals();
    }
    
    HandleVertex(wordsArr)
    {
        if (wordsArr.length <= 3) {
            console.log("Invalid vertex line: ", wordsArr);
            return;
        }
        
        for (var i = 1; i < wordsArr.length; i++) {
            var num = parseFloat(wordsArr[i]);
            if (num === NaN) {
                console.log("Bad vertex num: ", wordsArr[i]);
                return;
            }
            this.vertices.push(num * this.scale);
        }
        
        if (this.floatsPerVertex === 0) {
            this.floatsPerVertex = wordsArr.length - 1;
        } else if (this.floatsPerVertex !== wordsArr.length - 1) {
            console.log("Floats per vertex and wordsArr mismatch: ",
                        this.floatsPerVertex,
                        wordsArr.length - 1);
        }
    }
    
    HandleNormal(wordsArr)
    {
        if (wordsArr.length <= 3) {
            console.log("Invalid normal line: ", wordsArr);
            return;
        }
        
        for (var i = 1; i < wordsArr.length; i++) {
            var num = parseFloat(wordsArr[i]);
            if (num === NaN) {
                console.log("Bad vertex num: ", wordsArr[i]);
                return;
            }
            this.normals.push(num);
        }
        
        if (this.floatsPerNormal === 0) {
            this.floatsPerNormal = wordsArr.length - 1;
        } else if (this.floatsPerNormal !== wordsArr.length - 1) {
            console.log("Floats per normal and wordsArr mismatch: ",
                        this.floatsPerNormal,
                        wordsArr.length - 1);
        }
    }
    
    HandleFace(wordsArr)
    {
        if (wordsArr.length <= 3) {
            console.log("Invalid face line: ", wordsArr);
            return;
        }
        
        for (var i = 1; i < wordsArr.length; i++) {
            var indicesArr = wordsArr[i].split("/");
            
            // vertex index
            if (indicesArr.length >= 1 && indicesArr[0].length >= 1) {
                var num = parseInt(indicesArr[0]);
                if (num === NaN) {
                    console.log("Invalid vertex index: ", indicesArr[0]);
                    return;
                }
                this.vertexIndices.push(num - 1); // 1 based to 0 based
            }
            // texture coord index
            if (indicesArr.length >= 2 && indicesArr[1].length >= 1) {
                var num = parseInt(indicesArr[1]);
                if (num === NaN) {
                    console.log("Invalid texture index: ", indicesArr[1]);
                    return;
                }
                // TODO - handle
                //this.vertexIndices.push(num);
                console.log("TODO - handle texture coord indices");
            }
            // normal index
            if (indicesArr.length >= 3 && indicesArr[2].length >= 1) {
                var num = parseInt(indicesArr[2]);
                if (num === NaN) {
                    console.log("Invalid normal index: ", indicesArr[2]);
                    return;
                }
                this.normalIndices.push(num - 1); // 1 based to 0 based
            }
        }
    }
    
    ReorderNormals()
    {
        if (this.normals.length <= 0) {
            console.log("Not reordering normals, length 0");
            return;
        }
        
        if (this.vertexIndices.length !== this.normalIndices.length) {
            console.log("vertex indices length != normal indices length");
            return;
        }
        
        if (this.floatsPerVertex !== this.floatsPerNormal) {
            console.log("Different floats per vertex than normals");
            return;
        }
        
        // new copy of array to reorder
        this.reorderedNormals = [].concat(this.vertices);
        if (this.reorderedNormals.length !== this.vertices.length) {
            alert("Reordered normals len != normals len");
        }
        
        // assuming three indices per vertex
        for (var index = 0; index < this.vertexIndices.length; index++) {
            
            // current vertex index and normal index
            var vFace = this.vertexIndices[index];
            var nFace = this.normalIndices[index];
            
            var normalCurrentIndex = nFace * this.floatsPerNormal;
            var desiredNormalIndex = vFace * this.floatsPerNormal;
            
            for (var n = 0; n < this.floatsPerNormal; n++) {
                if (desiredNormalIndex + n >= this.reorderedNormals.length) {
                    console.log("Warning - desired normal index > reordered length");
                } else {
                    this.reorderedNormals[desiredNormalIndex + n] =
                    this.normals[normalCurrentIndex + n];
                }
            }
        }
        
        if (this.reorderedNormals.length !== this.vertices.length) {
            alert("after reordered length !=== this vertices length");
        }
    }
    
    InitBuffers(gl)
    {
        // number of element indices to draw
        this.n = this.vertexIndices.length;
    
        // create the buffer object
        this.vertexBuffer = gl.createBuffer();
        this.normalBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        if (!this.vertexBuffer || !this.indexBuffer || !this.normalBuffer) {
            console.log("Failed to create vertex or index buffer obj");
            return -1;
        }
        
        // bind the buffer object that we are currently referring to
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // send data to the buffer
        var verticesArr = new Float32Array(this.vertices);
        gl.bufferData(gl.ARRAY_BUFFER, verticesArr, gl.STATIC_DRAW);
        
        // bind the buffer object that we are currently referring to
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        // send data to the buffer
        var normalsArr = new Float32Array(this.reorderedNormals);
        gl.bufferData(gl.ARRAY_BUFFER, normalsArr, gl.STATIC_DRAW);
        
        // send elements (indices) data to the index buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        var indexArr = new Uint32Array(this.vertexIndices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexArr, gl.STATIC_DRAW);
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
        
        // tell opengl about the data we just sent it
        gl.vertexAttribPointer(aPosition,   // the attribute location
                               this.floatsPerVertex,          // number of points per vertex (x,y,z)
                               gl.FLOAT,   // vertex data type
                               false,      // does the data need normalization?
                               0, // how many bytes to move to the next vertex (0 for default)
                               0);         // first vertex entry offset
        // give opengl the OK to use these properties for this attribute
        gl.enableVertexAttribArray(aPosition);
        
        // bind the buffer object that we are currently referring to
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        
        // Get vertex attribute
        var aNormal = gl.getAttribLocation(gShader.program, "aNormal");
        if (aNormal < 0) {
            console.log("Failed to get aNormals attribute");
            return -1;
        }
        
        // tell opengl about the data we just sent it
        gl.vertexAttribPointer(aNormal,   // the attribute location
                               this.floatsPerNormal,          // number of points per vertex (x,y,z)
                               gl.FLOAT,   // vertex data type
                               false,      // does the data need normalization?
                               0, // how many bytes to move to the next vertex (0 for default)
                               0);         // first vertex entry offset
        // give opengl the OK to use these properties for this attribute
        gl.enableVertexAttribArray(aNormal);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.n, gl.UNSIGNED_INT, 0);
    }
}

