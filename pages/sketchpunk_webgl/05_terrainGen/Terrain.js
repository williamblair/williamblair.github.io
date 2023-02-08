class Terrain {
  static createModel(gl, keepRawData) {
    return new Model(Terrain.createMesh(gl, 10,10, 20,20, keepRawData));
  }
  static createMesh(gl, w,h, rLen,cLen, keepRawData) {
    var rStart = w / -2; // row start position when calculating z
    var cStart = h / -2; // col start position when calculating x
    var vLen = rLen * cLen; // total vertices
    var iLen = (rLen - 1) * cLen; // total index values need to create triangle strip (not counting degenerating)
    var cInc = w / (cLen - 1);
    var rInc = h / (rLen - 1);
    var cRow = 0;
    var cCol = 0;
    var aVert = []; // vertices array
    var aIndex = []; // indices array
    var aUV = []; // texture coord array
    var uvxInc = 1 / (cLen - 1);
    var uvyInc = 1 / (rLen - 1);

    // Perlin noise
    noise.seed(1);
    var h = 0;
    var freq = 13;
    var maxHeight = -3;

    // generate vertices
    for (var i=0; i < vLen; ++i) {
      cRow = Math.floor(i / cLen);
      cCol = i % cLen;
      h = noise.perlin2((cRow + 1) / freq, (cCol + 1) / freq) * maxHeight;

      aVert.push(cStart + cCol*cInc, 0.2 + h, rStart + cRow*rInc);

      aUV.push(
        (cCol == cLen - 1) ? 1 : cCol * uvxInc,
        (cRow == rLen - 1) ? 1 : cRow * uvyInc
      );

      if (i < iLen) {
        // column index of row R and R+1
        aIndex.push(cRow * cLen + cCol, (cRow + 1) * cLen + cCol);

        // create degenerate triangle, last and first index of the next row
        if (cCol == cLen - 1 && i < iLen - 1) {
          aIndex.push((cRow + 1) * cLen + cCol, (cRow + 1) * cLen);
        }
      }
    }

    // generate normals based on heights of surrounding points
    var x;
    var y;
    var p;
    var pos;
    var xMax = cLen - 1;
    var yMax = rLen - 1;
    var nX = 0;
    var nY = 0;
    var nZ = 0;
    var nL = 0;
    var hL; // left vector height
    var hR; // right vector height
    var hD; // down vector height
    var hU; // up vector height
    var aNorm = [];

    for (var i=0; i<vLen; ++i) {
      y = Math.floor(i / cLen);
      x = i % cLen;
      pos = y * 3 * cLen + x * 3;

      // get left neighbor height
      if (x > 0) {
        p = y*3*cLen + (x-1) * 3;
        hL = aVert[p+1];
      } else {
        hL = aVert[pos+1];
      }

      // get right neighbor height
      if (x < xMax) {
        p = y*3*cLen + (x+1) * 3;
        hR = aVert[p+1];
      }
      else {
        hR = aVert[pos+1];
      }

      // get up neighbor height
      if (y > 0) {
        p = (y-1)*3*cLen + x*3;
        hU = aVert[p+1];
      }
      else {
        hU = aVert[pos+1];
      }

      // get down neighbor height
      if (y < yMax) {
        p = (y+1)*3*cLen + x*3;
        hD = aVert[p+1];
      }
      else {
        hD = aVert[pos+1];
      }

      // calculate normal vector
      nX = hL - hR;
      nY = 2.0;
      nZ = hD - hU;
      nL = Math.sqrt( nX*nX + nY*nY + nZ*nZ );
      aNorm.push(nX/nL, nY/nL, nZ/nL); // normalized vector
    }

    var mesh = gl.fCreateMeshVAO("Terrain", aIndex, aVert, aNorm, aUV, 3);
    mesh.drawMode = gl.TRIANGLE_STRIP;
    if (keepRawData) {
      mesh.aVert = aVert;
      mesh.aNorm = aNorm;
      mesh.aIndex = aIndex;
    }
    return mesh;
  }
}
