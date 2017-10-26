/* kind of the main() function, called
 * when the document body is loaded */

/* global variables */
/* the OpenGL context */
var gl;
  
/* shader program id */
var shaderId;
  
/* vertex/array buffers for the square and triangle */
var triangleVertexPositionBuffer;
var squareVertexPositionBuffer;

var mvMatrix = mat4.create(); // move/translate matrix
var pMatrix = mat4.create();  // projection matrix

/* utility function - makes the above 2 matrices active */
/* tell opengl we're using these as our translation and projection matrices */
var setMatrixUniforms = function() {
  gl.uniformMatrix4fv(shaderId.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderId.mvMatrixUniform, false, mvMatrix);
};

/* basically main() */
var webGLStart = function() {
  /* Get the canvas */
  var canvas = document.getElementById('mycanvas');
  
  /* initialize WebGL */
  initGL(canvas);
  initShaders();
  initBuffers();
  
  /* set the background color */
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  
  drawScene();
};
