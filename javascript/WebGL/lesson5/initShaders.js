/* Loads shaders with the getShader function
 * and then creates the shader program */
var initShaders = function(){
  var fragmentShader = getShader(gl, 'shader-fs');
  var vertexShader = getShader(gl, 'shader-vs');
  
  /* create and attach both shaders to the program */
  shaderId = gl.createProgram();
  gl.attachShader(shaderId, vertexShader);
  gl.attachShader(shaderId, fragmentShader);
  gl.linkProgram(shaderId);
  
  /* error check the program */
  if(!gl.getProgramParameter(shaderId, gl.LINK_STATUS)) {
    alert('Failed to initialize shaders!');
  }
  
  /* switch to use our new shader */
  gl.useProgram(shaderId);
  
  /* aVertexPosition specified in the vertex shader */
  shaderId.vertexPositionAttribute = gl.getAttribLocation(shaderId, 'aVertexPosition');
  gl.enableVertexAttribArray(shaderId.vertexPositionAttribute);

  shaderId.textureCoordAttribute = gl.getAttribLocation(shaderId, "aTextureCoord");
  gl.enableVertexAttribArray(shaderId.textureCoordAttribute);

  /* aVertexColor specified in the vertex shader */
  //shaderId.vertexColorAttribute = gl.getAttribLocation(shaderId, 'aVertexColor');
  //gl.enableVertexAttribArray(shaderId.vertexColorAttribute);
  
  shaderId.pMatrixUniform = gl.getUniformLocation(shaderId, 'uPMatrix');
  shaderId.mvMatrixUniform = gl.getUniformLocation(shaderId, 'uMVMatrix');
  shaderId.samplerUniform = gl.getUniformLocation(shaderId, "uSampler");
};