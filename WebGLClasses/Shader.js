/* Shader class */

class Shader 
{
    /* 
     * Constructor 
     */
    constructor(vertexShaderStr, fragmentShaderStr)
    {
        this.vertexShader = this.createShader(
                gl.VERTEX_SHADER, vertexShaderStr
            );

        this.fragmentShader = this.createShader(
                gl.FRAGMENT_SHADER, fragmentShaderStr
            );

        this.shaderProgram = gl.createProgram();
        gl.attachShader(this.shaderProgram, this.vertexShader);
        gl.attachShader(this.shaderProgram, this.fragmentShader);
        gl.linkProgram(this.shaderProgram);

        if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialize shaders!");
        }

        this.use();

    }

    /*
     * Creates either a vertex or fragment shader 
     */
    createShader(shaderType, source) {
        var shader = gl.createShader(shaderType);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    /*
     * Tell WebGL to use our shader 
     */
    use() {
        gl.useProgram(this.shaderProgram);
    }

    /*
     * Get and set the reference to the vertex attribute
     * In the shader
     */
    set vertexAttrib(attribName) {

        this._vertexAttrib = gl.getAttribLocation(
                this.shaderProgram,
                attribName
            );

        gl.enableVertexAttribArray(this._vertexAttrib);
    }

    get vertexAttrib() {
        return this._vertexAttrib;
    }

    /*
     * Get and set the reference to the texture coord attribute
     * In the shader
     */
    set texCoordAttrib(attribName) {

        this._texCoordAttrib = gl.getAttribLocation(
                this.shaderProgram,
                attribName
            );

        gl.enableVertexAttribArray(this._texCoordAttrib);
    }

    get texCoordAttrib() {
        return this._texCoordAttrib;
    }

    /*
     * Get and set the reference to the projection matrix uniform
     * In the shader
     */
    set projMatUniform(uniformName) {

        this._projMatUniform = gl.getUniformLocation(
                this.shaderProgram,
                uniformName
            );

    }

    get projMatUniform() {
        return this._projMatUniform;
    }

    /*
     * Get and set the reference to the Model View matrix uniform
     * In the shader
     */
    set modelViewMatUniform(uniformName) {

        this._modelViewMatUniform = gl.getUniformLocation(
                this.shaderProgram,
                uniformName
            );

    }

    get modelViewMatUniform() {
        return this._modelViewMatUniform;
    }

    /*
     * Get and set the reference to the sampler uniform
     * In the shader
     */
    set samplerUniform(uniformName) {

        this._samplerUniform = gl.getUniformLocation(
                this.shaderProgram,
                uniformName
            );

    }

    get samplerUniform() {
        return this._samplerUniform;
    }
};




