class Shader
{
    constructor(gl, vertexStr, fragmentStr)
    {
        this.vertexShader = this.CreateShader(gl,
                                              gl.VERTEX_SHADER,
                                              vertexStr);
        this.fragmentShader = this.CreateShader(gl,
                                                gl.FRAGMENT_SHADER,
                                                fragmentStr);

        this.program = gl.createProgram();
        gl.attachShader(this.program, this.vertexShader);
        gl.attachShader(this.program, this.fragmentShader);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            alert("Could not initialize shaders!");
        }

        this.Use(gl);
    }

    CreateShader(gl, shaderType, source)
    {
        var shader = gl.createShader(shaderType);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    Use(gl)
    {
        gl.useProgram(this.program);
    }

    /* Input is assumed to be a Float32Array elements */
    SetVec3fv(gl, uniformName, vec)
    {
        const uniformLoc = gl.getUniformLocation(this.program,
                                                 uniformName);
        if (uniformLoc <= 0) {
            alert("Failed to get uniform location: " + uniformName);
        } else {
            gl.uniform3fv(uniformLoc, vec);
        }
    }
    SetVec3f(gl, uniformName, x, y, z)
    {
        const uniformLoc = gl.getUniformLocation(this.program,
                                                 uniformName);
        if (uniformLoc <= 0) {
            alert("Failed to get uniform location: " + uniformName);
        } else {
            gl.uniform3f(uniformLoc, x, y, z);
        }
    }
    SetMat4fv(gl, uniformName, arr)
    {
        const uniformLoc = gl.getUniformLocation(this.program,
                                                 uniformName);
        if (uniformLoc <= 0) {
            alert("Failed to get uniform location: " + uniformName);
        } else {
            gl.uniformMatrix4fv(uniformLoc, false, arr);
        }
    }
}

