/* initialize the GL canvas */
var initGL = function(canvas) {
  try{
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  }
  catch(e) {
  }
  
  if(!gl) {
    alert('Failed to initialize WebGL!');
  }
};