/*
 * Wraps OpenGL context and drawing calls
 */
class Renderer {

    /**
      @brief Renderer constructor
      @param [canvasID] String of the canvas document element ID to use for the context
    */
    constructor(canvasID) {
        this.canvas = document.getElementById(canvasID);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        Debug.Log(
            "canvas width, height: " +
            this.canvas.width + ", " + this.canvas.height
        );
        if (!this.canvas) {
            Debug.Error("Renderer Constructor: failed to get canvas");
        }
        this.gl = this.canvas.getContext("webgl2");
        if (!this.gl) {
            Debug.Error("Renderer Constructor: failed to get WebGL2 context");
        }
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.clearColor = [1.0, 1.0, 1.0];
        this.gl.clearColor(
            this.clearColor[0],
            this.clearColor[1],
            this.clearColor[2],
            1.0
        );
        this.gl.enable(this.gl.DEPTH_TEST);
        const aspect = (1.0*this.canvas.width) / (1.0*this.canvas.height);
        const fovDegrees = 45.0;
        this.perspectiveMatrix = mat4.create();
        mat4.perspective(
            this.perspectiveMatrix,
            fovDegrees,
            aspect,
            1.0,
            1000.0,
        );
    }

    /**
      @brief Set the background color to clear to each BeginFrame()
      @param [color] 3 element array of colors from 0..1
    */
    SetClearColor(color) {
        if (color.length != 3) {
            Debug.Error("Renderer SetClearColor: input color length not 3");
            return;
        }
        this.clearColor = color;
        this.gl.clearColor(
            this.clearColor[0],
            this.clearColor[1],
            this.clearColor[2],
            1.0
        );
    }

    BeginFrame() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
    EndFrame() {
    }

    DrawMesh(mesh) {
        this.gl.bindVertexArray(mesh.vao);
        if (mesh.numIndices > 0) {
            this.gl.drawElements(
                mesh.drawMode,
                mesh.numIndices,
                this.gl.UNSIGNED_INT,
                0
            );
        }
        else {
            //Debug.Log('mesh num vertices: ' + mesh.numVertices);
            this.gl.drawArrays(
                mesh.drawMode,
                0,
                mesh.numVertices
            );
        }
        this.gl.bindVertexArray(null);
    }
}
