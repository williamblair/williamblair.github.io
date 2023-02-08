class GridAxisShader extends Shader {
    constructor(gl, pMatrix) {
        var vertSrc = 
          `#version 300 es
          
          in vec3 aPosition;
          layout(location=4) in float aColor;

          uniform mat4 uMVMatrix;
          uniform mat4 uCameraMatrix;
          uniform mat4 uPMatrix;
          
          uniform vec3 uColor[4];
          out lowp vec4 color;

          void main() {
              color = vec4( uColor[int(aColor)], 1.0);
              gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(aPosition, 1.0);
          }`;

        var fragSrc = 
          `#version 300 es
           precision mediump float;
           
          in vec4 color;
          out vec4 finalColor;
          
          void main() {
              finalColor = color;
          }`;

        super(gl, vertSrc, fragSrc);

        this.setPerspectiveMatrix(pMatrix);

        // custom uniform
        var uColor = gl.getUniformLocation(this.program, "uColor");
        gl.uniform3fv(uColor, new Float32Array(
          [ 0.8, 0.8, 0.8,
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0 ]
        ));

        gl.useProgram(null);
    }
}

