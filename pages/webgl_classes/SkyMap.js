/* SkyMap class */
class SkyMap {
    /**
        @brief SkyMap constructor
        @param [gl] webgl instance
        @param [right] string dom id of right cube image
        @param [left] string dom id of left cube image
        @param [top] string dom id of top cube image
        @param [bottom] string dom id of bottom cube image
        @param [back] string dom id of back cube image
        @param [front] string dom id of front cube image
        @param [flipY] bool wether to flip texture y coord; default false
    */
    constructor(gl, right, left, top, bottom, back, front, flipY) {
        flipY = flipY || false;
        this.gl = gl;
        this.texture = null;
        this.mesh = null;
        this.createTex(right, left, top, bottom, back, front, flipY);
        // TODO - not hardcode width/height/depth
        this.createMesh(20, 20, 20);
    }

    createMesh(width, height, depth) {
        var w = width*0.5, h = height*0.5, d = depth*0.5;
        //var x0 = x-w, x1 = x+w, y0 = y-h, y1 = y+h, z0 = z-d, z1 = z+d;
        var x0 = -w, x1 = w, y0 = -h, y1 = h, z0 = -d, z1 = d;

        var aVert = [
          x0, y1, z1, //0 Front
          x0, y0, z1, //1
          x1, y0, z1,  //2
          x1, y1, z1,  //3
          x1, y1, z0,  //4 Back
          x1, y0, z0,  //5
          x0, y0, z0,  //6
          x0, y1, z0,  //7
          x0, y1, z0,  //7 Left
          x0, y0, z0,  //6
          x0, y0, z1,  //1
          x0, y1, z1,  //0
          x0, y0, z1,  //1 Bottom
          x0, y0, z0,  //6
          x1, y0, z0,  //5
          x1, y0, z1,  //2
          x1, y1, z1,  //3 Right
          x1, y0, z1,  //2
          x1, y0, z0,  //5
          x1, y1, z0,  //4
          x0, y1, z0, //7 Top
          x0, y1, z1, //0
          x1, y1, z1, //3
          x1, y1, z0  //4
        ];

        //Build the index of each quad [0,1,2, 2,3,0]
        var aIndex = [];
        for(var i=0; i < aVert.length / 3; i+=2) {
            //Build in reverse order so the inside renders but not the outside
            aIndex.push((Math.floor(i/4)*4)+((i+2)%4), i+1, i);
        }

        //Create VAO
        //this.mesh = this.gl.fCreateMeshVAO("SkymapCube",aIndex,aVert,null,null);
        this.mesh = new Mesh(this.gl, aVert, 3, aIndex);
    }

    createTex(right, left, top, bottom, back, front, flipY) {
        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texture);

        var rightDom = document.getElementById(right);
        var leftDom = document.getElementById(left);
        var topDom = document.getElementById(top);
        var bottomDom = document.getElementById(bottom);
        var backDom = document.getElementById(back);
        var frontDom = document.getElementById(front);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, flipY);
        this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, rightDom);
        this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, leftDom);
        this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, topDom);
        this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, bottomDom);
        this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, backDom);
        this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, frontDom);

        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_R, this.gl.CLAMP_TO_EDGE);

        if (flipY) {
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
        }

        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, null);
    }

    /**
        @brief update input shader uniforms
        @param [perspectiveMatrix] mat4 persp. matrix
        @param [viewMatrix] mat4 view matrix
    */
    SetUniforms(shader, perspectiveMatrix, viewMatrix) {
        shader.SetMatrixUniform(
            Shader.PERSPECTIVE_MAT_UNIFORM,
            perspectiveMatrix
        );
        shader.SetMatrixUniform(
            Shader.VIEW_MAT_UNIFORM,
            viewMatrix
        );
    }

    /**
        @brief set the cube map texture as active
    */
    Use() {
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texture);
    }
}
