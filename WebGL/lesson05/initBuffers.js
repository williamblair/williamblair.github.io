/* Defines and initializes the array/vertex buffers
 * for the triangle and the square */

var initBuffers = function() {
  
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

  squareVertexTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(g.ARRAY_BUFFER, squareVertexTextureCoordBuffer);

  /* Texture coordinate positions */
  var textureCoords = [
    // front face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,

    // back face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // top face
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,

    // bottom face
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,

    // right face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // left face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
  squareVertexTextureCoordBuffer.itemSize = 2,
  squareVertexTextureCoordBuffer.numItems = 24;

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