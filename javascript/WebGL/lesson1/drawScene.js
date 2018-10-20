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
  mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);
  
  /* Bind and draw the triangle */
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
  gl.vertexAttribPointer(
    shaderId.vertexPositionAttribute,
    triangleVertexPositionBuffer.itemSize,
    gl.FLOAT, 
    false, 
    0, 0
  );
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
  
  /* Bind and draw the square */
  mat4.translate(mvMatrix, [3.0, 0.0, 0.0]); // move 3 to the right
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
  gl.vertexAttribPointer(
    shaderId.vertexPositionAttribute,
    squareVertexPositionBuffer.itemSize,
    gl.FLOAT, 
    false, 
    0, 0
  );
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
};