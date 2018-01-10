/* Defines and initializes the array/vertex buffers
 * for the triangle and the square */

var initBuffers = function() {
  
  /************************************************************/
  /**                 Init the Triangle                      **/
  /************************************************************/
  triangleVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);

  /* Triangle Vertices */
  var vertices = [
    0.0, 1.0, 0.0,
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0
  ];
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  triangleVertexPositionBuffer.itemSize = 3;
  triangleVertexPositionBuffer.numItems = 3;

  triangleVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);

  /* Triangle Colors */
  var colors = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  triangleVertexColorBuffer.itemSize = 4; // 4 coordinates per vertex
  triangleVertexColorBuffer.numItems = 3; // 3 vertices
  
  /************************************************************/
  /**                   Init the Square                      **/
  /************************************************************/
  squareVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
  
  /* Square Vertices */
  vertices = [
    1.0, 1.0, 0.0,
    -1.0, 1.0, 0.0,
    1.0, -1.0, 0.0,
    -1.0, -1.0, 0.0
  ];
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  squareVertexPositionBuffer.itemSize = 3; // using triangles
  squareVertexPositionBuffer.numItems = 4; // 4 coordinates

  squareVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);

  /* Square Colors */
  colors = []; // empty the list
  for(var i=0; i<4; i++) { // one color vec for each point
    colors = colors.concat([0.5, 0.5, 1.0, 1.0]); // the same color for each point
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  squareVertexColorBuffer.itemSize = 4; // 4 coordinates per vertex
  squareVertexColorBuffer.numItems = 4; // 4 vertices
};