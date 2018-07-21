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
  mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);

  /* Store the current position matrix */
  mvPushMatrix();

  /* Rotate the position matrix 
   * must convert to radians, and rotate around the y axis */
  mat4.rotate(mvMatrix, angle * Math.PI / 180, [0, 1, 0]);
  
  /* Bind and draw the triangle */
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
  gl.vertexAttribPointer(
    shaderId.vertexPositionAttribute,
    triangleVertexPositionBuffer.itemSize,
    gl.FLOAT, 
    false, 
    0, 0
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
  gl.vertexAttribPointer(
    shaderId.vertexColorAttribute,
    triangleVertexColorBuffer.itemSize,
    gl.FLOAT,
    false,
    0, 0
  );

  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);

  /* Restore the matrix before rotation, so we end up in the correct
   * position for the square */
  mvPopMatrix();
  
  /* Bind and draw the square */
  mat4.translate(mvMatrix, [3.0, 0.0, 0.0]); // move 3 to the right

  /* Again save the current state of the matrix */
  mvPushMatrix();

  /* Rotate again */
  mat4.rotate(mvMatrix, angle * Math.PI / 180, [1, 1, 1]);

  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
  gl.vertexAttribPointer(
    shaderId.vertexPositionAttribute,
    squareVertexPositionBuffer.itemSize,
    gl.FLOAT, 
    false, 
    0, 0
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
  gl.vertexAttribPointer(
    shaderId.vertexColorAttribute,
    squareVertexColorBuffer.itemSize,
    gl.FLOAT,
    false,
    0, 0
  );

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer);
  setMatrixUniforms();
  gl.drawElements(gl.TRIANGLES, squareVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  mvPopMatrix(); // restore the matrix before rotate

};