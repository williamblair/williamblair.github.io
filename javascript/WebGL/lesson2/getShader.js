/* loads a shader script 
 * args - canvas context, shader script element id */
var getShader = function(gl, id) {
  var shaderScript = document.getElementById(id);
  if(!shaderScript) {
    return null;
  }
  
  /* determine and set type of either fragment
   * or vertex shader */
  var shader;
  if(id == "shader-fs") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  }
  //else if(shaderScript.type == "x-shader/x-vertex") {
  else if(id == "shader-vs"){
    shader = gl.createShader(gl.VERTEX_SHADER);
  }
  else {
    return null;
  }
  
  /* register and compile the shader */
  if(id == "shader-fs") {
    gl.shaderSource(shader, fragmentShaderText); // defined in fragmentShader.js
  }
  else if(id == "shader-vs"){
	gl.shaderSource(shader, vertexShaderText); // defined in vertexShader.js
  }
  gl.compileShader(shader);
  
  /* test for error */
  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }
  
  return shader;
};