class MD2Model
{

/*
 * gl = webgl context
 * gShader = shader instance
 * dataBuffer = MD2 data Uint8Array
 * texId = texture img element ID name
 */
constructor(gl, gShader, dataBuffer, texId)
{
  this.md2view = new DataView(dataBuffer.buffer);
  this.md2VertexBuf = null;
  this.md2TexCoordBuf = null;
  this.md2TexData = null;
  this.md2TexWidth = 0;
  this.md2TexHeight = 0;
  this.verticesArr = null;
  this.texCoordsArr = null;
  this.texId = texId;
  this.interpolation = 0.0;
  this.currentFrame = 0;
  this.nextFrame = 1;
  this.startFrame = 0;
  this.endFrame = 39;
  this.loopAnim = true;

  this.md2Header = this.GetMD2Header(dataBuffer);
  this.skins = this.GetMD2Skins(this.md2Header, dataBuffer);
  this.md2TexCoords = this.GetMD2TexCoords(this.md2Header, dataBuffer);
  this.triangles = this.GetMD2Triangles(this.md2Header, dataBuffer);
  this.keyFrames = this.GetMD2KeyFrames(this.md2Header, dataBuffer);
  this.ScaleMD2Keyframes();
  this.texCoords = this.ScaleMD2TexCoords();
  this.ReorganizeMD2Vertices();

  this.interpolatedFrame = this.keyFrames[0];
  this.currentAnimName = this.keyFrames[0].name;

  this.LoadMd2Texture();
  this.InitBuffers(gl);
  this.InitTexture(gl, gShader);
}

/*
 * gl = webgl instance
 * dt = time since last frame in seconds
 */
Update(gl, dt) {
  const FRAMES_PER_SECOND = 8.0;
  this.interpolation += dt * FRAMES_PER_SECOND;
  if (this.interpolation >= 1.0) {
    this.currentFrame = this.nextFrame;
    ++this.nextFrame;
    if (this.nextFrame > this.endFrame)
    {
      if (this.loopAnim) {
        this.nextFrame = this.startFrame;
      }
      else {
        this.nextFrame = this.endFrame;
        this.startFrame = this.endFrame;
      }
    }

    this.interpolation = 0.0;
  }

  var t = this.interpolation;
  var i = 0;
  function lerp(a,b,t) {
    return a + (t * (b-a));
  }
  for (var vtx = 0; vtx < this.interpolatedFrame.vertices.length/3; ++vtx) {
    var x1 = this.keyFrames[this.currentFrame].vertices[i*3+0];
    var x2 = this.keyFrames[this.nextFrame].vertices[i*3+0];
    var x = lerp(x1, x2, t);

    var y1 = this.keyFrames[this.currentFrame].vertices[i*3+1];
    var y2 = this.keyFrames[this.nextFrame].vertices[i*3+1];
    var y = lerp(y1, y2, t);

    var z1 = this.keyFrames[this.currentFrame].vertices[i*3+2];
    var z2 = this.keyFrames[this.nextFrame].vertices[i*3+2];
    var z = lerp(z1, z2, t);

    this.interpolatedFrame.vertices[vtx*3 + 0] = x;
    this.interpolatedFrame.vertices[vtx*3 + 1] = y;
    this.interpolatedFrame.vertices[vtx*3 + 2] = z;

    ++i;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, this.md2VertexBuf);
  this.verticesArr.set(this.interpolatedFrame.vertices);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.verticesArr);
}

/*
 * gl = webgl instance
 * gShader = Shader class instance
 */
Draw(gl, gShader) {
  gl.bindBuffer(gl.ARRAY_BUFFER, this.md2VertexBuf);
  var aPosition = gl.getAttribLocation(gShader.program, "aPosition");
  if (aPosition < 0) {
    console.log('Failed to get aPosition attrib');
    return;
  }
  gl.vertexAttribPointer(aPosition,
                         3,
                         gl.FLOAT,
                         false,
                         0,
                         0);
  gl.enableVertexAttribArray(aPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.md2TexCoordBuf);
  var aTexCoord = gl.getAttribLocation(gShader.program, "aTexCoord");
  if (aTexCoord < 0) {
    console.log('Failed to get aTexCoord attrib');
    return;
  }
  gl.vertexAttribPointer(aTexCoord,
                         2,
                         gl.FLOAT,
                         false,
                         0,
                         0);
  gl.enableVertexAttribArray(aTexCoord);

  gl.drawArrays(gl.TRIANGLES, 0, this.verticesArr.length/3);
}

GetInt32(index) { return this.md2view.getInt32(index, true); } // true = little endian
GetInt16(index) { return this.md2view.getInt16(index, true); }
GetFloat32(index) { return this.md2view.getFloat32(index, true); }


/*
 * Internal helper funcs below
 */

InitBuffers(gl)
{
  this.md2VertexBuf = gl.createBuffer();
  this.md2TexCoordBuf = gl.createBuffer();
  if (!this.md2VertexBuf || !this.md2TexCoordBuf) {
    console.log('Failed to create webgl buf');
    return;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, this.md2VertexBuf);
  this.verticesArr = new Float32Array(this.interpolatedFrame.vertices);
  gl.bufferData(gl.ARRAY_BUFFER, this.verticesArr, gl.DYNAMIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.md2TexCoordBuf);
  this.texCoordsArr = new Float32Array(this.texCoords);
  gl.bufferData(gl.ARRAY_BUFFER, this.texCoordsArr, gl.STATIC_DRAW);
}

InitTexture(gl, gShader)
{
  var texture = gl.createTexture();
  var uSampler = gl.getUniformLocation(gShader.program, "uSampler");
  if (uSampler < 0) {
    console.log("Failed to get uSampler uniform");
    return;
  }

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  var imgData = new ImageData(this.md2TexData, 
      this.md2TexWidth, this.md2TexHeight);
  console.log('gl imgData:', imgData);
  gl.texImage2D(gl.TEXTURE_2D,
                0,
                gl.RGBA, // internal format
                gl.RGBA, // input format
                gl.UNSIGNED_BYTE,
                imgData);
  gl.uniform1i(uSampler, 0); // gl texture0
}


GetMD2Header(data) {
  var index = 0;

  // header magic
  if (data[0] != 'I'.charCodeAt(0) ||
      data[1] != 'D'.charCodeAt(0) ||
      data[2] != 'P'.charCodeAt(0) ||
      data[3] != '2'.charCodeAt(0))
  {
    console.log('Invalid header magic');
    return null;
  }
  index += 4;

  // md2 version
  const version = this.GetInt32(index); index += 4;
  if (version != 8)
  {
    console.log('Unexpected version (expected 8): ', version);
    return null;
  }

  // texture width/height
  var skinWidth = this.GetInt32(index); index += 4;
  var skinHeight = this.GetInt32(index); index += 4;

  // size of 1 keyframe in bytes
  var frameSize = this.GetInt32(index); index += 4;

  // number of items
  var numSkins     = this.GetInt32(index); index += 4;
  var numVertices  = this.GetInt32(index); index += 4;
  var numTexCoords = this.GetInt32(index); index += 4;
  var numTriangles = this.GetInt32(index); index += 4;
  var numGLCmds    = this.GetInt32(index); index += 4;
  var numFrames    = this.GetInt32(index); index += 4;

  // offsets to items
  var skinOffset     = this.GetInt32(index); index += 4;
  var texCoordOffset = this.GetInt32(index); index += 4;
  var triangleOffset = this.GetInt32(index); index += 4;
  var frameOffset    = this.GetInt32(index); index += 4;
  var GLCmdOffset    = this.GetInt32(index); index += 4;
  var eofOffset      = this.GetInt32(index); index += 4;

  return {
    magic: [data[0], data[1], data[2], data[3]],
    version: version,
    skinWidth: skinWidth,
    skinHeight: skinHeight,
    frameSize: frameSize,
    numSkins: numSkins,
    numVertices: numVertices,
    numTexCoords: numTexCoords,
    numTriangles: numTriangles,
    numGLCmds: numGLCmds,
    numFrames: numFrames,
    skinOffset: skinOffset,
    texCoordOffset: texCoordOffset,
    triangleOffset: triangleOffset,
    frameOffset: frameOffset,
    GLCmdOffset: GLCmdOffset,
    eofOffset: eofOffset
  };
}

GetMD2Skins(md2Header, data) {
  var index = md2Header.skinOffset;
  const numSkins = md2Header.numSkins;
  var skins = [];
  for (var i = 0; i < numSkins; ++i) {
    var subArray = data.slice(index, index+64);
    var skinStr = '';
    for (var j = 0; j < 64 && subArray[j] != 0; ++j) {
      skinStr = skinStr + (String.fromCharCode(subArray[j]));
    }
    index += 64;
    skins.push(skinStr);
  }
  return skins;
}

GetMD2TexCoords(md2Header, data) {
  var index = md2Header.texCoordOffset;
  const numTexCoords = md2Header.numTexCoords;
  var texCoords = [];
  for (var i = 0; i < numTexCoords; ++i) {
    var s = this.GetInt16(index); index += 2;
    var t = this.GetInt16(index); index += 2;
    texCoords.push({s: s, t: t});
  }
  return texCoords;
}

GetMD2Triangles(md2Header, data) {
  var index = md2Header.triangleOffset;
  const numTriangles = md2Header.numTriangles;
  var triangles = [];
  for (var i = 0; i < numTriangles; ++i) {
    var vertIndices = [];
    vertIndices.push(this.GetInt16(index)); index += 2;
    vertIndices.push(this.GetInt16(index)); index += 2;
    vertIndices.push(this.GetInt16(index)); index += 2;
    var texCoordIndices = [];
    texCoordIndices.push(this.GetInt16(index)); index += 2;
    texCoordIndices.push(this.GetInt16(index)); index += 2;
    texCoordIndices.push(this.GetInt16(index)); index += 2;
    
    triangles.push({vertIndex: vertIndices, texCoordIndex: texCoordIndices});
  }

  return triangles;
}

GetMD2KeyFrames(md2Header, data) {
  var index = md2Header.frameOffset;
  const numKeyframes = md2Header.numFrames;
  var keyFrames = [];
  for (var i = 0; i < numKeyframes; ++i) {
    var scales = [];
    scales.push(this.GetFloat32(index)); index += 4;
    scales.push(this.GetFloat32(index)); index += 4;
    scales.push(this.GetFloat32(index)); index += 4;

    var translates = [];
    translates.push(this.GetFloat32(index)); index += 4;
    translates.push(this.GetFloat32(index)); index += 4;
    translates.push(this.GetFloat32(index)); index += 4;

    var name = '';
    for (var j = 0; j < 16 && data[index + j] != 0; ++j) {
      name = name + (String.fromCharCode(data[index+j]));
    }
    index += 16;

    const numVertices = md2Header.numVertices;
    var vertices = [];
    for (var j = 0; j < numVertices; ++j) {
      var v = [data[index+0], data[index+1], data[index+2]]; index += 3;
      var lightNormIndex = data[index]; ++index;
      vertices.push({v: v, lightNormIndex: lightNormIndex});
    }

    keyFrames.push({ scale: scales,
                     translate: translates,
                     name: name,
                     md2Vertices: vertices });
  }

  return keyFrames;
}

ScaleMD2Keyframes() {
  for (var kf = 0; kf < this.keyFrames.length; ++kf) {
    var frame = this.keyFrames[kf];
    var k = 0;
    var vertices = [];
    for (var vx = 0; vx < frame.md2Vertices.length; ++vx) {
      var x = frame.scale[0] * parseFloat(frame.md2Vertices[k].v[0]) + frame.translate[0];
      var z = frame.scale[1] * parseFloat(frame.md2Vertices[k].v[1]) + frame.translate[1];
      var y = frame.scale[2] * parseFloat(frame.md2Vertices[k].v[2]) + frame.translate[2];

      x /= 64.0;
      y /= 64.0;
      z /= 64.0;

      vertices.push(x);
      vertices.push(y);
      vertices.push(z);

      ++k;
    }
    this.keyFrames[kf].vertices = vertices;
  }
}

ScaleMD2TexCoords() {
  var scaledTexCoords = [];
  this.md2TexCoords.forEach((texCoord, index) => {
    var s = (1.0*texCoord.s) / (1.0*this.md2Header.skinWidth);
    var t = (1.0*texCoord.t) / (1.0*this.md2Header.skinHeight);
    scaledTexCoords.push(s);
    scaledTexCoords.push(t);
  });
  return scaledTexCoords;
}

ReorganizeMD2Vertices() {
  var tmpTexCoords = [];
  var texCoordsDone = false;

  for (var kf = 0; kf < this.keyFrames.length; ++kf) {
    var tmpVertices = [];

    for (var i = 0; i < this.triangles.length; ++i) {
      for (var j = 0; j < 3; ++j) {
        var x = this.keyFrames[kf].vertices[this.triangles[i].vertIndex[j]*3 + 0];
        var y = this.keyFrames[kf].vertices[this.triangles[i].vertIndex[j]*3 + 1];
        var z = this.keyFrames[kf].vertices[this.triangles[i].vertIndex[j]*3 + 2];
        tmpVertices.push(x);
        tmpVertices.push(y);
        tmpVertices.push(z);

        // only copy texture coords once
        if (!texCoordsDone) {
          tmpTexCoords.push(this.texCoords[this.triangles[i].texCoordIndex[j]*2 + 0]);
          tmpTexCoords.push(this.texCoords[this.triangles[i].texCoordIndex[j]*2 + 1]);
        }
      }
    }

    texCoordsDone = true;
    this.keyFrames[kf].vertices = tmpVertices;
  }

  this.texCoords = tmpTexCoords;
}

LoadMd2Texture() {
  var canvas = document.createElement('canvas');
  var img = document.getElementById(this.texId);
  canvas.width = img.width;
  canvas.height = img.height;

  console.log('img canvas width, height: ', canvas.width, canvas.height)

  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0,0);

  var imgData = ctx.getImageData(0, 0, img.width, img.height);
  console.log('imgData:', imgData);

  this.md2TexData = imgData.data;
  this.md2TexWidth = imgData.width;
  this.md2TexHeight = imgData.height;
  console.log('md2TexData:', this.md2TexData);

  canvas.width = 0;
  canvas.height = 0;
  canvas.remove();
}

}

