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

