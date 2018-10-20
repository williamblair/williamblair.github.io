/* Defines and initializes the array/vertex buffers
 * for the triangle and the square */

var initBuffers = function() {
  
  /************************************************************/
  /**                 Init the Triangle                      **/
  /************************************************************/
  triangleVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);

  /* Triangle Vertices  - 3d now, so multiple for each face */
  var vertices = [
    // front face
    0.0, 1.0, 0.0,
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,

    // right face
    0.0, 1.0, 0.0,
    1.0, -1.0, 1.0,
    1.0, -1.0, -1.0,

    // back face
    0.0, 1.0, 0.0,
    1.0, -1.0, -1.0,
    -1.0, -1.0, -1.0,

    // left face
    0.0, 1.0, 0.0,
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0
  ];
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  triangleVertexPositionBuffer.itemSize = 3;
  triangleVertexPositionBuffer.numItems = 12; // 12 different points now (3 for each face)

  triangleVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);

  /* Triangle Colors  - one for each face now */
  var colors = [
    // front face
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,

    // right face
    0.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,

    // back face
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 0.0, 1.0,

    // left face
    0.0, 1.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  triangleVertexColorBuffer.itemSize = 4; // 4 values per vertex
  triangleVertexColorBuffer.numItems = 12; // 3 vertices per face * 4 faces
  
  /************************************************************/
  /**                   Init the Square                      **/
  /************************************************************/
  squareVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
  
  /* Square Vertices */
  vertices = [
    // front face
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,

    // back face
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,

    // top face
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,

    // bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,

    // right face
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,

    // left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0

  ];
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  squareVertexPositionBuffer.itemSize = 3; // using triangles
  squareVertexPositionBuffer.numItems = 24; // 4 coordinates

  squareVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);

  /* Square Colors */
  colors = [
    [1.0, 0.0, 0.0, 1.0], // front face
    [0.0, 1.0, 0.0, 1.0], // back face
    [0.0, 0.0, 1.0, 1.0], // top face
    [1.0, 0.0, 1.0, 1.0], // bottom face
    [1.0, 1.0, 0.0, 1.0], // right face
    [0.0, 1.0, 1.0, 1.0]  // left face
  ];
  var unpackedColors = []; // the final list of colors for the square
  /* go through each vec4 in colors and assign it to the 
   * 4 points of a face */
  for(var c in colors) {
    var color = colors[c];
    for(var j=0; j<4; j++) {
      unpackedColors = unpackedColors.concat(color); // add a row to the master list
    }
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
  squareVertexColorBuffer.itemSize = 4; // 4 coordinates per vertex
  squareVertexColorBuffer.numItems = 24; // 4*6 vertices (4 vertices, 6 faces)

  squareVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer);
  var cubeVertexIndices = [
    0,  1,  2,    0,  2,  3,  // front face - two groups of 3 vertices since each square is made out of a triangle
    4,  5,  6,    4,  6,  7,  // back face
    8,  9,  10,   8,  10, 11, // top face
    12, 13, 14,   12, 14, 15, // bottom face
    16, 17, 18,   16, 18, 19, // right face
    20, 21, 22,   20, 22, 23  // left face 
  ];
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
  squareVertexIndexBuffer.itemSize = 1;
  squareVertexIndexBuffer.numItems = 36; // 6 faces * 6 indices per face
};