/* kind of the main() function, called
 * when the document body is loaded */

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
