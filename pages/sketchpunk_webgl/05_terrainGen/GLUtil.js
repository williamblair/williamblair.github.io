class GLUtil {

    // convert hex colors to array of floats 0.0...1.0
    // ex) GLUtil.rgbArray("#FF0000", "#00FF00", "#0000FF")
    static rgbArray() {
        if (arguments.length == 0) return null;

        var rtn = [];
        for (var i = 0, c, p; i < arguments.length; ++i) {
            // skip if invalid
            if (arguments[i].length < 6) continue;

            c = arguments[i];
            p = (c[0] == "#") ? 1 : 0;

            rtn.push(
                parseInt(c[p+0] + c[p+1], 16) / 255.0,
                parseInt(c[p+2] + c[p+3], 16) / 255.0,
                parseInt(c[p+4] + c[p+5], 16) / 255.0
            );
        }

        return rtn;
    }
}

function GLInstance(canvasID) {
    var canvas = document.getElementById(canvasID);
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        console.error("webgl context not available");
        return null;
    }

    // stores loaded mesh information
    gl.mMeshCache = [];
    // stores loaded texture information
    gl.mTextureCache = [];

    // opengl configuration
    gl.cullFace(gl.BACK); // default
    gl.frontFace(gl.CCW); // default
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.fClear = function() {
        this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
        return this;
    }

    gl.fSetSize = function(w,h) {
        this.canvas.style.width = w + "px";
        this.canvas.style.height = h + "px";
        this.canvas.width = w;
        this.canvas.height = h;

        this.viewport(0,0,w,h);
        return this;
    }

    // set canvas size to fill up a % of the total screen
    gl.fFitScreen = function(wp, hp) {
        return this.fSetSize(
          window.innerWidth * (wp || 1),
          window.innerHeight * (hp || 1)
        );
    }

    gl.fCreateMeshVAO = function(name, aryInd, aryVert, aryNorm, aryUV, vertCompLen) {
        var rtn = { drawMode: this.TRIANGLES };

        // create and bind VAO
        rtn.vao = this.createVertexArray();
        this.bindVertexArray(rtn.vao);

        // set up vertices
        if (aryVert !== undefined && aryVert != null) {
            rtn.bufVertices = this.createBuffer();
            if (vertCompLen !== undefined && vertCompLen > 0) {
                rtn.vertexComponentLen = vertCompLen;
            }
            else {
                rtn.vertexComponentLen = 3;
            }
            rtn.vertexCount = aryVert.length / rtn.vertexComponentLen;

            this.bindBuffer(this.ARRAY_BUFFER, rtn.bufVertices);
            this.bufferData(this.ARRAY_BUFFER, new Float32Array(aryVert), this.STATIC_DRAW);
            this.enableVertexAttribArray(ATTR_POSITION_LOC);
            this.vertexAttribPointer(ATTR_POSITION_LOC, rtn.vertexComponentLen, this.FLOAT, false, 0,0);
        }

        // set up normals
        if (aryNorm !== undefined && aryNorm != null) {
            rtn.bufNormals = this.createBuffer();
            rtn.normalComponentLen = 3;
            this.bindBuffer(this.ARRAY_BUFFER, rtn.bufNormals);
            this.bufferData(this.ARRAY_BUFFER, new Float32Array(aryNorm), this.STATIC_DRAW);
            this.enableVertexAttribArray(ATTR_NORMAL_LOC);
            this.vertexAttribPointer(ATTR_NORMAL_LOC, rtn.normalComponentLen, this.FLOAT, false, 0,0);
        }

        // set up tex coords
        if (aryUV !== undefined && aryUV != null) {
            rtn.bufUV = this.createBuffer();
            rtn.uvComponentLen = 2;
            this.bindBuffer(this.ARRAY_BUFFER, rtn.bufUV);
            this.bufferData(this.ARRAY_BUFFER, new Float32Array(aryUV), this.STATIC_DRAW);
            this.enableVertexAttribArray(ATTR_UV_LOC);
            this.vertexAttribPointer(ATTR_UV_LOC, rtn.uvComponentLen, this.FLOAT, false, 0,0);
        }

        // set up indices
        if (aryInd !== undefined && aryInd != null) {
            rtn.bufIndices = this.createBuffer();
            rtn.indexLength = aryInd.length;
            this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, rtn.bufIndices);
            this.bufferData(this.ELEMENT_ARRAY_BUFFER, new Uint16Array(aryInd), this.STATIC_DRAW);
        }

        // cleanup
        this.bindVertexArray(null);
        this.bindBuffer(this.ARRAY_BUFFER, null);
        if (aryInd !== undefined && aryInd != null) {
            this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, null);
        }

        // save the info for later use
        this.mMeshCache[name] = rtn;
        return rtn;
    }

    gl.fCreateArrayBuffer = function(floatAry, isStatic) {
        if (isStatic === undefined) isStatic = true;

        var buf = this.createBuffer();
        this.bindBuffer(this.ARRAY_BUFFER, buf);
        this.bufferData(this.ARRAY_BUFFER, floatAry, (isStatic) ? this.STATIC_DRAW : this.DYNAMIC_DRAW);
        this.bindBuffer(this.ARRAY_BUFFER, null);
        return buf;
    }

    gl.fLoadTexture = function(name, img, doYFlip, noMips) {
        var tex = this.createTexture();
        this.mTextureCache[name] = tex;
        return this.fUpdateTexture(name, img, doYFlip, noMips);
    }

    gl.fUpdateTexture = function(name, img, doYFlip, noMips) {
        var tex = this.mTextureCache[name];
        if (doYFlip == true) {
            this.pixelStorei(this.UNPACK_FLIP_Y_WEBGL, true);
        }

        this.bindTexture(this.TEXTURE_2D, tex);
        this.texImage2D(this.TEXTURE_2D, 0, this.RGBA, this.RGBA, this.UNSIGNED_BYTE, img);

        if (noMips === undefined || noMips == false) {
            this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MAG_FILTER, this.LINEAR);
            this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MIN_FILTER, this.LINEAR_MIPMAP_NEAREST);
            this.generateMipmap(this.TEXTURE_2D);
        }
        else {
            this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MAG_FILTER, this.NEAREST);
            this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MIN_FILTER, this.NEAREST);
            this.texParameteri(this.TEXTURE_2D, this.TEXTURE_WRAP_S, this.CLAMP_TO_EDGE);
            this.texParameteri(this.TEXTURE_2D, this.TEXTURE_WRAP_T, this.CLAMP_TO_EDGE);
        }

        this.bindTexture(this.TEXTURE_2D, null);

        if (doYFlip == true) {
            this.pixelStorei(this.UNPACK_FLIP_Y_WEBGL, false);
        }
        return tex;
    }

    // images must be in correct order: RIGHT, LEFT, TOP, BOTTOM, BACK, FRONT
    gl.fLoadCubeMap = function(name, imgAry) {
        if (imgAry.length != 6) return null;

        var tex = this.createTexture();
        this.bindTexture(this.TEXTURE_CUBE_MAP, tex);

        for (var i=0; i<6; ++i) {
            this.texImage2D(this.TEXTURE_CUBE_MAP_POSITIVE_X + i,
                0,
                this.RGBA,
                this.RGBA,
                this.UNSIGNED_BYTE,
                imgAry[i]
            );
        }

        this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_MAG_FILTER, this.LINEAR);
        this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_MIN_FILTER, this.LINEAR);
        this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_WRAP_S, this.CLAMP_TO_EDGE);
        this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_WRAP_T, this.CLAMP_TO_EDGE);
        this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_WRAP_R, this.CLAMP_TO_EDGE);

        this.bindTexture(this.TEXTURE_CUBE_MAP, null);
        this.mTextureCache[name] = tex;
        return tex;
    }

    return gl;
}
