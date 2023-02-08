// uniform block object
class UBO {
    constructor(gl, blockName, blockPoint, bufSize, aryCalc) {
      this.items = [];
      this.keys = [];

      for (var i = 0; i < aryCalc.length; ++i) {
        this.items[aryCalc[i].name] = {
          offset: aryCalc[i].offset,
          dataLen: aryCalc[i].dataLen,
          chunkLen:aryCalc[i].chunkLen
        };
        this.keys[i] = aryCalc[i].name;
      }

      this.gl = gl;
      this.blockName = blockName;
      this.blockPoint = blockPoint;

      this.buf = gl.createBuffer();
      gl.bindBuffer(gl.UNIFORM_BUFFER, this.buf);
      gl.bufferData(gl.UNIFORM_BUFFER, bufSize, gl.DYNAMIC_DRAW); // allocates needed space
      gl.bindBuffer(gl.UNIFORM_BUFFER, null);
      gl.bindBufferBase(gl.UNIFORM_BUFFER, blockPoint, this.buf); // assign to block point
    }

    // update one of the entries in the block buffer
    update(name, data) {
      if (!(data instanceof Float32Array)) {
        if (Array.isArray(data)) data = new Float32Array(data);
        else                     data = new Float32ARray([data]); // single value needs to turn into an array
      }

      this.gl.bindBuffer(gl.UNIFORM_BUFFER, this.buf);
      this.gl.bufferSubData(
        this.gl.UNIFORM_BUFFER,
        this.items[name].offset,
        data,
        0, null
      );

      return this;
    }

    // block name is name of struct in shader
    static create(gl, blockName, blockPoint, ary) {
      var bufSize = UBO.calculate(ary);
      UBO.Cache[blockName] = new UBO(gl, blockName, blockPoint, bufSize, ary);
      UBO.debugVisualize(UBO.Cache[blockName]);
    }

    // returns [alignment, size]
    static getSize(type) {
      switch (type) {
        case "mat4": return [16*4, 16*4];
        case "mat3": return [16*3, 16*3];
        case "vec2": return [8, 8];
        case "f":
        case "i":
        case "b":
          return [4, 4];
        case "vec3":
          return [16, 12]; // special case
        case "vec4":
          return [16, 16];
        default:
          return [0, 0];
      }
    }

    static calculate(ary) {
      var chunk = 16; // data size alignment in bytes
      var tsize = 0;
      var offset = 0;
      var size = 0;

      for (var i=0; i < ary.length; ++i) {
        // when dealing with arrays, each element is 16 bytes regardless of type
        if (!ary[i].arylen || ary[i].arylen == 0) {
          size = UBO.getSize(ary[i].type);
        }
        else {
          size = [ary[i].arylen * 16, ary[i].arylen * 16];
        }

        tsize = chunk - size[0]; // how much of chunk exists after taking the size of the data
        // not enough room in remaining space
        if (tsize < 0 && chunk < 16) {
          offset += chunk;
          if (i > 0) {
            ary[i-1].chunkLen += chunk;
          }
          chunk = 16;
        }
        else if (tsize < 0 && chunk == 16) {
          // do nothing in case data length >= unused chunk size
        }
        else if (tsize == 0) {
          //chunk = 16; // if evenly fills, closes out the chunk, reset
          if (ary[i].type == "vec3" && chunk == 16) {
            chunk -= size[1];
          }
          else {
            chunk = 16;
          }
        }
        else {
          chunk -= size; // next element fits within available chunk
        }

        ary[i].offset = offset;
        ary[i].chunkLen = size[1];
        ary[i].dataLen = size[1];

        offset += size[1];
      }

      // make sure total size is 16byte aligned
      // doesn't seem to be necessary...
      //if (offset % 16 != 0) {
      //  ary[ary.length - 1].chunkLen += chunk;
      //  offset += chunk;
      //}

      console.log("UBO buffer size:", offset);
      return offset;
    }

    static debugVisualize(ubo) {
      var str = "";
      var chunk = 0;
      var tchunk = 0;
      var itm = null;

      for (var i=0; i < ubo.keys.length; ++i) {
        itm = ubo.items[ubo.keys[i]];
        console.log(ubo.keys[i],itm);

        chunk = itm.chunkLen / 4;
        for (var x=0; x < chunk; ++x) {
          str += (x == 0 || x == chunk-1) ? "|." + i + "." : "|...";
          tchunk++;
          if (tchunk % 4 == 0) {
            str += "| ~ ";
          }
        }
      }

      if (tchunk % 4 != 0) {
        str += "|";
      }

      console.log(str);
    }
}
UBO.Cache = [];

class ShaderBuilder{
    constructor(gl,vertShader,fragShader){
        //If the text is small, then its most likely DOM names (very hack) else its actual Source.
        //TODO, Maybe check for new line instead of length, Dom names will never have new lines but source will.
        if(vertShader.length < 20)    this.program = ShaderUtil.domShaderProgram(gl,vertShader,fragShader,true);
        else                        this.program = ShaderUtil.createProgramFromText(gl,vertShader,fragShader,true);

        if(this.program != null){
            this.gl = gl;
            gl.useProgram(this.program);
            this.mUniformList = [];        //List of Uniforms that have been loaded in. Key=UNIFORM_NAME {loc,type}
            this.mTextureList = [];        //List of texture uniforms, Indexed {loc,tex}

            this.noCulling = false;        //If true disables culling
            this.doBlending = false;    //If true, allows alpha to work.
        }
    }

    //---------------------------------------------------
    // Methods For Shader Prep.
    //---------------------------------------------------
    //Takes in unlimited arguments. Its grouped by two so for example (UniformName,UniformType): "uColors","3fv"
    prepareUniforms(){
        if(arguments.length % 2 != 0 ){ console.log("prepareUniforms needs arguments to be in pairs."); return this; }

        var loc = 0;
        for(var i=0; i < arguments.length; i+=2){
            loc = gl.getUniformLocation(this.program,arguments[i]);
            if(loc != null) this.mUniformList[arguments[i]] = {loc:loc,type:arguments[i+1]};
        }
        return this;
    }

    // block point/index is similar to uniform location
    prepareUniformBlocks(ubo, blockIndex) {
      var ind = 0;
      for (var i=0; i < arguments.length; i+= 2) {
        this.gl.uniformBlockBinding(this.program, arguments[i+1], arguments[i].blockPoint);
      }
      return this;
    }

    //Takes in unlimited arguments. Its grouped by two so for example (UniformName,CacheTextureName): "uMask01","tex001";
    prepareTextures(){
        if(arguments.length % 2 != 0){ console.log("prepareTextures needs arguments to be in pairs."); return this; }

        var loc = 0,tex = "";
        for(var i=0; i < arguments.length; i+=2){
            tex = this.gl.mTextureCache[arguments[i+1]];
            if(tex === undefined){ console.log("Texture not found in cache " + arguments[i+1]); continue; }

            loc = gl.getUniformLocation(this.program,arguments[i]);
            if(loc != null) this.mTextureList.push({loc:loc,tex:tex});
        }
        return this;
    }

    //---------------------------------------------------
    // Setters Getters
    //---------------------------------------------------
    //Uses a 2 item group argument array. Uniform_Name, Uniform_Value;
    setUniforms(){
        if(arguments.length % 2 != 0){ console.log("setUniforms needs arguments to be in pairs."); return this; }

        var name;
        for(var i=0; i < arguments.length; i+=2){
            name = arguments[i];
            if(this.mUniformList[name] === undefined){ console.log("uniform not found " + name); return this; }

            switch(this.mUniformList[name].type){
                case "2fv":        this.gl.uniform2fv(this.mUniformList[name].loc, new Float32Array(arguments[i+1])); break;
                case "3fv":        this.gl.uniform3fv(this.mUniformList[name].loc, new Float32Array(arguments[i+1])); break;
                case "4fv":        this.gl.uniform4fv(this.mUniformList[name].loc, new Float32Array(arguments[i+1])); break;
                case "mat4":    this.gl.uniformMatrix4fv(this.mUniformList[name].loc,false,arguments[i+1]); break;
                default: console.log("unknown uniform type for " + name); break;
            }
        }

        return this;
    }

    //---------------------------------------------------
    // Methods
    //---------------------------------------------------
    activate(){ this.gl.useProgram(this.program); return this; }
    deactivate(){ this.gl.useProgram(null); return this; }

    //function helps clean up resources when shader is no longer needed.
    dispose(){
        //unbind the program if its currently active
        if(this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) this.gl.useProgram(null);
        this.gl.deleteProgram(this.program);
    }

    preRender(){
        this.gl.useProgram(this.program); //Save a function call and just activate this shader program on preRender

        //If passing in arguments, then lets push that to setUniforms for handling. Make less line needed in the main program by having preRender handle Uniforms
        if(arguments.length > 0) this.setUniforms.apply(this,arguments);

        //..........................................
        //Prepare textures that might be loaded up.
        //TODO, After done rendering need to deactivate the texture slots
        if(this.mTextureList.length > 0){
            var texSlot;
            for(var i=0; i < this.mTextureList.length; i++){
                texSlot = this.gl["TEXTURE" + i];
                this.gl.activeTexture(texSlot);
                this.gl.bindTexture(this.gl.TEXTURE_2D,this.mTextureList[i].tex);
                this.gl.uniform1i(this.mTextureList[i].loc,i);
            }
        }

        return this;
    }

    //Handle rendering a modal
    renderModel(model, doShaderClose){
        this.setUniforms("uMVMatrix",model.transform.getViewMatrix());
        this.gl.bindVertexArray(model.mesh.vao);

        if(model.mesh.noCulling || this.noCulling) this.gl.disable(this.gl.CULL_FACE);
        if(model.mesh.doBlending || this.doBlending) this.gl.enable(this.gl.BLEND);

        if(model.mesh.indexLength) this.gl.drawElements(model.mesh.drawMode, model.mesh.indexLength, gl.UNSIGNED_SHORT, 0);
        else this.gl.drawArrays(model.mesh.drawMode, 0, model.mesh.vertexCount);

        //Cleanup
        this.gl.bindVertexArray(null);
        if(model.mesh.noCulling || this.noCulling) this.gl.enable(this.gl.CULL_FACE);
        if(model.mesh.doBlending || this.doBlending) this.gl.disable(this.gl.BLEND);

        if(doShaderClose) this.gl.useProgram(null);

        return this;
    }
}

// GL constants
const ATTR_POSITION_NAME = "aPosition";
const ATTR_POSITION_LOC = 0;
const ATTR_NORMAL_NAME = "aNorm";
const ATTR_NORMAL_LOC = 1;
const ATTR_UV_NAME = "aUv";
const ATTR_UV_LOC = 2;

class ShaderUtil{


    //-------------------------------------------------
    // Main utility functions
    //-------------------------------------------------

    //get the text of a script tag that are storing shader code.
    static domShaderSrc(elmID){
        var elm = document.getElementById(elmID);
        if(!elm || elm.text == ""){ console.log(elmID + " shader not found or no text."); return null; }

        return elm.text;
    }

    //Create a shader by passing in its code and what type
    static createShader(gl,src,type){
        var shader = gl.createShader(type);
        gl.shaderSource(shader,src);
        gl.compileShader(shader);

        //Get Error data if shader failed compiling
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            console.error("Error compiling shader : " + src, gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    //Link two compiled shaders to create a program for rendering.
    static createProgram(gl,vShader,fShader,doValidate){
        //Link shaders together
        var prog = gl.createProgram();
        gl.attachShader(prog,vShader);
        gl.attachShader(prog,fShader);

        // force location of attributes
        gl.bindAttribLocation(prog, ATTR_POSITION_LOC, ATTR_POSITION_NAME);
        gl.bindAttribLocation(prog, ATTR_NORMAL_LOC, ATTR_NORMAL_NAME);
        gl.bindAttribLocation(prog, ATTR_UV_LOC, ATTR_UV_NAME);

        gl.linkProgram(prog);

        //Check if successful
        if(!gl.getProgramParameter(prog, gl.LINK_STATUS)){
            console.error("Error creating shader program.",gl.getProgramInfoLog(prog));
            gl.deleteProgram(prog); return null;
        }

        //Only do this for additional debugging.
        if(doValidate){
            gl.validateProgram(prog);
            if(!gl.getProgramParameter(prog,gl.VALIDATE_STATUS)){
                console.error("Error validating program", gl.getProgramInfoLog(prog));
                gl.deleteProgram(prog); return null;
            }
        }

        //Can delete the shaders since the program has been made.
        gl.detachShader(prog,vShader); //TODO, detaching might cause issues on some browsers, Might only need to delete.
        gl.detachShader(prog,fShader);
        gl.deleteShader(fShader);
        gl.deleteShader(vShader);

        return prog;
    }

    //-------------------------------------------------
    // Helper functions
    //-------------------------------------------------

    //Pass in Script Tag IDs for our two shaders and create a program from it.
    static domShaderProgram(gl,vertID,fragID,doValidate){
        var vShaderTxt    = ShaderUtil.domShaderSrc(vertID);                               if(!vShaderTxt) return null;
        var fShaderTxt    = ShaderUtil.domShaderSrc(fragID);                               if(!fShaderTxt) return null;
        var vShader        = ShaderUtil.createShader(gl,vShaderTxt,gl.VERTEX_SHADER);      if(!vShader)    return null;
        var fShader        = ShaderUtil.createShader(gl,fShaderTxt,gl.FRAGMENT_SHADER);
        if (!fShader) {
            gl.deleteShader(vShader);
            return null;
        }

        return ShaderUtil.createProgram(gl,vShader,fShader,true);
    }

    static createProgramFromText(gl, vText, fText, doValidate) {
        var vShader        = ShaderUtil.createShader(gl,vText,gl.VERTEX_SHADER);      if(!vShader)    return null;
        var fShader        = ShaderUtil.createShader(gl,fText,gl.FRAGMENT_SHADER);
        if (!fShader) {
            gl.deleteShader(vShader);
            return null;
        }

        return ShaderUtil.createProgram(gl,vShader,fShader,true);
    }

    //---------------------------------------------------
    // Setters / Getters
    //---------------------------------------------------

    // Get the bound attrib locations. Location = -1 if not found
    static getStandardAttribLocations(gl, program) {
        return {
            position: gl.getAttribLocation(program, ATTR_POSITION_NAME),
            normal:   gl.getAttribLocation(program, ATTR_NORMAL_NAME),
            uv:       gl.getAttribLocation(program, ATTR_UV_NAME)
        };
    }

    // Get the matrix uniform locations. Location = -1 if not found
    static getStandardUniformLocations(gl, program) {
        return {
            perspectiveMatrix:  gl.getUniformLocation(program, "uPMatrix"),
            modelMatrix:        gl.getUniformLocation(program, "uMVMatrix"),
            cameraMatrix:       gl.getUniformLocation(program, "uCameraMatrix"),
            mainTexture:        gl.getUniformLocation(program, "uMainTex")
        };
    }
}

class Shader{

    constructor(gl, vShaderSrc, fShaderSrc) {
        this.program = ShaderUtil.createProgramFromText(gl, vShaderSrc, fShaderSrc, true);

        if (this.program != null) {
            this.gl = gl;
            gl.useProgram(this.program);
            this.attribLoc = ShaderUtil.getStandardAttribLocations(gl, this.program);
            this.uniformLoc = ShaderUtil.getStandardUniformLocations(gl, this.program);
        }
    }

    activate() { this.gl.useProgram(this.program); return this; }
    deactivate() { this.gl.useProgram(null); return this; }

    setPerspectiveMatrix(matData) {
        this.gl.uniformMatrix4fv(this.uniformLoc.perspectiveMatrix, false, matData);
        return this;
    }
    setModelMatrix(matData) {
        this.gl.uniformMatrix4fv(this.uniformLoc.modelMatrix, false, matData);
        return this;
    }
    setCameraMatrix(matData) {
        this.gl.uniformMatrix4fv(this.uniformLoc.cameraMatrix, false, matData);
        return this;
    }

    // clean up resources
    dispose() {
        if (this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) {
            this.gl.useProgram(null);
        }
        this.gl.deleteProgram(this.program);
    }

    // abstract method; extended object may need to do some things before rendering
    preRender(){}

    // Handle rendering a model
    renderModel(model) {
        this.setModelMatrix(model.transform.getViewMatrix());
        this.gl.bindVertexArray(model.mesh.vao);

        if (model.mesh.noCulling) { this.gl.disable(this.gl.CULL_FACE); }
        if (model.mesh.doBlending) { this.gl.enable(this.gl.BLEND); }

        if (model.mesh.indexLength) {
            this.gl.drawElements(model.mesh.drawMode, model.mesh.indexLength, gl.UNSIGNED_SHORT, 0);
        }
        else {
            this.gl.drawArrays(model.mesh.drawMode, 0, model.mesh.vertexCount);
        }

        this.gl.bindVertexArray(null);
        if (model.mesh.noCulling) this.gl.enable(this.gl.CULL_FACE);
        if (model.mesh.doBlending) this.gl.disable(this.gl.BLEND);

        return this;
    }
}
