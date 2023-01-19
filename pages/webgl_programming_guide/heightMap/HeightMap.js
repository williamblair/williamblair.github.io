class HeightMap
{
    // a .RAW image to use as the heightmap
    constructor(/*rawFileName*/rawArray, width = 65, heightScale = 10.0, sizeScale = 1.0)
    {
        this.heights = null;
        this.vertices = null;
        this.colors = null;
        this.indices = null;
        this.width = width;
        
        /*var request = new XMLHttpRequest();
        request.open("GET", rawFileName, false); // false makes it synchronous
        request.send(null);
        
        if (request.status === 200) {
            this.OnRawLoad(request.responseText, heightScale, sizeScale);
        } else {
            console.log("HeightMap RAW request failed, status: ", request.status);
        }*/
        this.OnRawLoad(rawArray, heightScale, sizeScale);
    }
    
    OnRawLoad(/*responseText*/rawArray, heightScale, sizeScale)
    {
        var width = this.width;
        //console.log("Got response text: ", responseText);
        if (/*responseText*/rawArray.length != width*width) {
            console.log("Warning: raw size != width*width");
        }
        var pxArray = new Uint8Array(rawArray);/*.from(responseText)*/;
        
        this.heights = [];
        this.colors = [];
        for (var i = 0; i < (width*width); ++i)
        {
            var pixel = pxArray[i];
            var value = pixel / 256.0; // normalize between 0 and 1
            this.heights.push(value * heightScale);
            this.colors.push(0.0);
            this.colors.push(value);
            this.colors.push(0.0);
        }
        
        this.GenerateVertices(sizeScale);
        this.GenerateIndices();
    }
    
    GenerateVertices(sizeScale)
    {
        var width = this.width;
        var heights = this.heights;

        var i = 0;
        this.vertices = [];
        for (var z = Math.floor(-width / 2); z < Math.floor(width / 2); z++) {
            for (var x = Math.floor(-width / 2); x < Math.floor(width / 2); x++) {
                this.vertices.push(x * sizeScale);
                this.vertices.push(heights[i]);
                this.vertices.push(z * sizeScale);
                i++;
            }
        }
    }
    
    GenerateIndices()
    {
        var width = this.width;
        
        /*
        We loop through building the triangles that
        make up each grid square in the heightmap

        (z*w+x) *----* (z*w+x+1)
                |   /| 
                |  / | 
                | /  |
        ((z+1)*w+x)*----* ((z+1)*w+x+1)
        */
        this.indices = [];
        for (var z = 0; z < width - 1; z++) {
            for (var x = 0; x < width - 1; x++) {
                
                this.indices.push((z * width) + x); // current point
                this.indices.push(((z+1) * width) + x); // next row
                this.indices.push((z * width) + x + 1); // same row, next column
                
                this.indices.push(((z+1) * width) + x); // next row
                this.indices.push(((z+1) * width) + x + 1); // next row, next column
                this.indices.push((z * width) + x + 1); // same row, next column
            }
        }
    }
    
    InitBuffers(gl)
    {
        // number of element indices to draw
        this.n = this.indices.length;
    
        // create the buffer object
        this.vertexBuffer = gl.createBuffer();
        this.colorBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        if (!this.vertexBuffer || !this.colorBuffer || !this.indexBuffer) {
            console.log("Failed to create vertex or index buffer obj");
            return -1;
        }
        
        // bind the buffer object that we are currently referring to
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // send data to the buffer
        var verticesArr = new Float32Array(this.vertices);
        gl.bufferData(gl.ARRAY_BUFFER, verticesArr, gl.STATIC_DRAW);
        
        // bind the buffer object that we are currently referring to
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        // send data to the buffer
        var colorsArr = new Float32Array(this.colors);
        gl.bufferData(gl.ARRAY_BUFFER, colorsArr, gl.STATIC_DRAW);
        
        /*// bind the buffer object that we are currently referring to
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        // send data to the buffer
        var normalsArr = new Float32Array(this.reorderedNormals);
        gl.bufferData(gl.ARRAY_BUFFER, normalsArr, gl.STATIC_DRAW);*/
        
        // send elements (indices) data to the index buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        var indexArr = new Uint32Array(this.indices);
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
        
        // bind the buffer object that we are currently referring to
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        
        // Get color attribute
        var aColor = gl.getAttribLocation(gShader.program, "aColor");
        if (aColor < 0) {
            console.log("Failed to get aColor attribute");
            return -1;
        }
        
        this.floatsPerVertex = 3;
        // tell opengl about the data we just sent it
        gl.vertexAttribPointer(aColor,   // the attribute location
                               this.floatsPerVertex, // number of components per vertex (r,g,b)
                               gl.FLOAT,   // vertex data type
                               false,      // does the data need normalization?
                               0, // how many bytes to move to the next vertex (0 for default)
                               0);         // first vertex entry offset
        // give opengl the OK to use these properties for this attribute
        gl.enableVertexAttribArray(aColor);
        
        /*// bind the buffer object that we are currently referring to
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
        gl.enableVertexAttribArray(aNormal);*/
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.n, gl.UNSIGNED_INT, 0);
    }
}
