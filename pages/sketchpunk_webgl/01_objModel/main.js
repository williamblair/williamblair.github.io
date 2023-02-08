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

    gl.fLoadTexture = function(name, img, doYFlip) {
        var tex = this.createTexture();
        if (doYFlip == true) {
            this.pixelStorei(this.UNPACK_FLIP_Y_WEBGL, true);
        }

        this.bindTexture(this.TEXTURE_2D, tex);
        this.texImage2D(this.TEXTURE_2D, 0, this.RGBA, this.RGBA, this.UNSIGNED_BYTE, img);

        this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MAG_FILTER, this.LINEAR);
        this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MIN_FILTER, this.LINEAR_MIPMAP_NEAREST);
        this.generateMipmap(this.TEXTURE_2D);

        this.bindTexture(this.TEXTURE_2D, null);
        this.mTextureCache[name] = tex;

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


// globals
var gl;

var camera = null;
var cameraCtrl = null;

var shader = null;
var model = null;
var model2 = null;

var skymap = null;

var gridFloor = null;

var mDebug = null;
var mDebugLine = null;

var rendLoop;

var radius = 1.5; // radius from the center to rotate the light
var angle = 0; // mnain angle var for light
var angleInc = 1; // how much to move per second
var yPos = 0; // current position of light
var yPosInc = 0.2; // how fast to move the light vertically per second
function onRender(dt) {

    gl.fClear();

    camera.updateViewMatrix();

    skymap.render(camera);
    gridFloor.render(camera);

    // move the light
    angle += angleInc * dt;
    yPos += yPosInc * dt;

    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const y = MathUtil.Map(Math.sin(yPos), -1,1,  0.1,2);
    mDebug.transform.position.set(x,y,z);

    shader.activate().preRender()
        .setCameraMatrix(camera.viewMatrix)
        .setCameraPos(camera)
        .setLightPos(mDebug)
        //.renderModel(model.preRender());
        .renderModel(model2.preRender());

    mDebug.render(camera);
}

class TestShader extends Shader {
    constructor(gl, pMatrix) {
        var vertSrc = ShaderUtil.domShaderSrc("vertexShader");
        var fragSrc = ShaderUtil.domShaderSrc("fragmentShader");

        super(gl, vertSrc, fragSrc);

        //this.uniformLoc.time = gl.getUniformLocation(this.program, "uTime");
        //var uColor = gl.getUniformLocation(this.program, "uColor");
        //gl.uniform3fv(uColor, new Float32Array(
        //    GLUtil.rgbArray("#FF0000", "00FF00", "0000FF", "909090", "C0C0C0", "404040")
        //));

        this.uniformLoc.lightPos = gl.getUniformLocation(this.program, "uLightPos");
        this.uniformLoc.camPos = gl.getUniformLocation(this.program, "uCamPos");
        this.uniformLoc.matNorm = gl.getUniformLocation(this.program, "uNormMatrix");

        this.setPerspectiveMatrix(pMatrix);

        this.mainTexture = -1;

        gl.useProgram(null);
    }

    setTexture(texId) { this.mainTexture = texId; return this; }
    //setTime(t) { this.gl.uniform1f(this.uniformLoc.time, t); return this; }
    setLightPos(obj) {
      this.gl.uniform3fv(
          this.uniformLoc.lightPos, 
          new Float32Array(obj.transform.position.getArray())
      );
      return this;
    }
    setCameraPos(obj) {
      this.gl.uniform3fv(
          this.uniformLoc.camPos, 
          new Float32Array(obj.transform.position.getArray())
      );
      return this;
    }

    // override
    preRender() {
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.mainTexture);
        this.gl.uniform1i(this.uniformLoc.mainTexture, 0);

        return this;
    }

    renderModel(model) {
        this.gl.uniformMatrix3fv(this.uniformLoc.matNorm, false, model.transform.getNormalMatrix());
        super.renderModel(model);
        return this;
    }
}

// called by body onload automatically
function main() {
    gl = GLInstance("mycanvas")
        .fFitScreen(0.95,0.9)
        .fClear();

    camera = new Camera(gl);
    camera.transform.position.set(0,1,3);
    cameraCtrl = new CameraController(gl, camera);

    skymap = new Skymap(gl);
    skymap.setDayTexByDom(
      "cube01Right",
      "cube01Left",
      "cube01Top",
      "cube01Bottom",
      "cube01Back",
      "cube01Front"
    );
    skymap.setNightTexByDom(
      "cube02Right",
      "cube02Left",
      "cube02Top",
      "cube02Bottom",
      "cube02Back",
      "cube02Front"
    );
    skymap.setTime(0.7);
    skymap.finalize();

    gridFloor = new GridFloor(gl);

    shader = new TestShader(gl, camera.projectionMatrix);

    model = Primitives.Cube.createModel(gl, "Cube", true);
    model.setPosition(0.0,0.0,0.0);

    gl.fLoadTexture("pirateObjTex",
        document.getElementById("pirateTex"),
        false
    );
    shader.setTexture(gl.mTextureCache["pirateObjTex"]);
    model2 = new Model(
        ObjLoader.domToMesh("PirateObj","pirateObj",true,true)
    );
    model2.setPosition(0.0, 0.0, 0.0)
          .setScale(0.5, 0.5, 0.5);

    mDebug = new VertexDebugger(gl,10)
        .addColor("#FF0000")
        .addPoint(0,0,0,0)
        .finalize();

    rendLoop = new RenderLoop(onRender).start();
}


