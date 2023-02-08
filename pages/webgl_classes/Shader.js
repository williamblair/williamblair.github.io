/* Shader class */
class Shader
{
    /**
        @brief Shader constructor
        @param [gl] the webgl shader context
        @param [vertexShaderStr] string of vertex shader code
        @param [fragmentShaderStr] string of fragment shader code
     */
    constructor(gl, vertexShaderStr, fragmentShaderStr) {
        this.gl = gl;
        this.vertexShader = this.createShader(
            this.gl.VERTEX_SHADER, vertexShaderStr
        );

        this.fragmentShader = this.createShader(
            this.gl.FRAGMENT_SHADER, fragmentShaderStr
        );

        this.shaderProgram = this.gl.createProgram();
        this.gl.attachShader(this.shaderProgram, this.vertexShader);
        this.gl.attachShader(this.shaderProgram, this.fragmentShader);
        this.gl.linkProgram(this.shaderProgram);

        if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
            Debug.Error("Shader Constructor: Could not initialize shaders!");
        }

        this.Use();

    }

    Use() {
        this.gl.useProgram(this.shaderProgram);
    }

    SetMatrixUniform(name, mat) {
        const loc = this.gl.getUniformLocation(this.shaderProgram, name);
        if (!loc) {
            Debug.Log("Shader SetMatrixUniform: failed to get location for: " + name);
            return;
        }

        this.gl.uniformMatrix4fv(loc, false, mat);
    }

    SetVec3Uniform(name, vec) {
        const loc = this.gl.getUniformLocation(this.shaderProgram, name);
        if (!loc) {
            Debug.Log("Shader SetVec3Uniform: failed to get location for " + name);
            return;
        }

        this.gl.uniform3fv(loc, vec);
    }

    SetFloatUniform(name, val) {
        const loc = this.gl.getUniformLocation(this.shaderProgram, name);
        if (!loc) {
            Debug.Log("Shader SetFloatUniform: failed to get location for " + name);
            return;
        }

        this.gl.uniform1f(loc, val);
    }

    SetIntUniform(name, val) {
      const loc = this.gl.getUniformLocation(this.shaderProgram, name);
      if (!loc) {
          Debug.Log("Shader SetIntUniform: failed to get location for " + name);
          return;
      }

      this.gl.uniform1i(loc, val);
    }

    createShader(shaderType, source) {
        var shader = this.gl.createShader(shaderType);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert(this.gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }
};

// constants
Shader.PERSPECTIVE_MAT_UNIFORM = "uPerspectiveMatrix";
Shader.VIEW_MAT_UNIFORM = "uViewMatrix";
Shader.MODEL_MAT_UNIFORM = "uModelMatrix";
Shader.LIGHT_POS_UNIFORM = "uLightPosition";
Shader.LIGHT_AMBIENT_UNIFORM = "uLightAmbient";
Shader.LIGHT_DIFFUSE_UNIFORM = "uLightDiffuse";
Shader.LIGHT_SPECULAR_UNIFORM = "uLightSpecular";
Shader.MATERIAL_AMBIENT_UNIFORM = "uMaterialAmbient";
Shader.MATERIAL_DIFFUSE_UNIFORM = "uMaterialDiffuse";
Shader.MATERIAL_SPECULAR_UNIFORM = "uMaterialSpecular";
Shader.MATERIAL_SHININESS_UNIFORM = "uMaterialShininess";
Shader.TEXTURE_UNIFORM = "uTexture";
Shader.CUBE_TEX_UNIFORM = "uCubeTexture";
