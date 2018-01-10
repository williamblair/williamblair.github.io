/* Saves the given move/model matrix */
var mvMatrixStack = [];
var mvPushMatrix = function() {
  var copy = mat4.create();
  mat4.set(mvMatrix, copy);
  mvMatrixStack.push(copy);
};
var mvPopMatrix = function() {
  if(mvMatrixStack.length === 0) {
    throw "Invalid Pop Matrix!";
  }
  mvMatrix =  mvMatrixStack.pop();
};

/* The function that actually draws to the canvas */
var drawScene = function() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  /* like glu lookat 
   * angle, aspect ratio, near clip, far clip, projection matrix */
  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
  
  /* ???? 
   * I think turns mvMatrix into an identity matrix */
  mat4.identity(mvMatrix);
  
  /* ????
   * I think makes mvMatrix a translation matrix moving 1.5 left, 7 forward */
  mat4.translate(mvMatrix, [0.0, 0.0, -7.0]);

  /* save the current state of the matrix */
  mvPushMatrix();

  /* Rotate again */
  mat4.rotate(mvMatrix, angle * Math.PI / 180, [1, 1, 1]);

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
  gl.vertexAttribPointer(
    shaderId.vertexPositionAttribute,
    cubeVertexPositionBuffer.itemSize,
    gl.FLOAT, 
    false, 
    0, 0
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
  gl.vertexAttribPointer(
    shaderId.textureCoordAttribute, 
    cubeVertexTextureCoordBuffer.itemSize,
    gl.FLOAT,
    false,
    0,0
  );

  /* WebGL can handle up to 32 at a time, we're using the first one */
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, myTexture);
  /* Tell the shader we're using texture 0 */
  gl.uniform1i(shaderId.samplerUniform, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
  setMatrixUniforms();
  gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  mvPopMatrix(); // restore the matrix before rotate

};