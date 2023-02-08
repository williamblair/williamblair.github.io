/*
 * JSON ThreeJS mesh format/adapted from
 * https://www.amazon.com/WebGL-Game-Development-Sumeet-Arora/dp/1849699798/ref=sr_1_2?dchild=1&keywords=webgl+game+development&qid=1632438302&sr=8-2
 */
 Geometry = function () {
    this.vertices = [];
    this.uvs=[[]];
    this.colors = [];
    this.normals = [];
    this.indices=[];
    this.faces = [];
    this.faceUvs = [[]];
    this.faceVertexUvs = [[]];
    this.textureCoordinates=[];
    this.materials=[];
 };
 Geometry.prototype = {
     constructor: Geometry,
     indicesFromFaces:function (){
         for(var i=0;i<this.faces.length;++i){
             this.indices.push(this.faces[i].a);
             this.indices.push(this.faces[i].b);
             this.indices.push(this.faces[i].c);
         }
     },
     verticesFromFaceUvs: function(vertices, uvs, materialIndex) {
         var vertexVectors = [];
         var redundantVertexVectors = [];

         var vertexCovered = [];
         //Copy vertices to a vec3 array
         for (var i = 0; i < vertices.length; i = i + 3) {
             var vector = vec3.fromValues(vertices[i], vertices[i + 1], vertices[i + 2]);
             vertexVectors.push(vector);
         }
         var count = 0;
         //Iterating over all uv indices for each vertex in a face.
         for (var i = 0; i < this.faceVertexUvs[materialIndex].length; ++i) {
             var face = this.faces[i];
             var textureIndices = this.faceVertexUvs[materialIndex][i];
             var aVertexIndices = ["a", "b", "c"];
             //Iterating over the each vertex of the face.
             for (var j = 0; j < aVertexIndices.length; ++j) {
                 var aVertexIndex = aVertexIndices[j];
                 //If the new vertex corresponding to texture co-ordinate points to same vertex as in redundant array or the coresponding vertex is not define din the redundante array.
                 if (redundantVertexVectors[textureIndices[aVertexIndex]] == face[aVertexIndex] || redundantVertexVectors[textureIndices[aVertexIndex]] === undefined) {
                     redundantVertexVectors[textureIndices[aVertexIndex]] = face[aVertexIndex];
                     face[aVertexIndex] = textureIndices[aVertexIndex];
                 }
                 else {
                 // The texture co-ordidanate holds the index of a different vertex duplicate the uv co-ordinate
                     uvs[materialIndex].push(uvs[materialIndex][textureIndices[aVertexIndex] * 2]);
                     uvs[materialIndex].push(uvs[materialIndex][textureIndices[aVertexIndex] * 2 + 1]);
                     var newIndex = Math.floor(uvs[materialIndex].length / 2) - 1;
                     redundantVertexVectors[newIndex] = face[aVertexIndex];
                     face[aVertexIndex] = newIndex;
                     textureIndices[aVertexIndex] = newIndex;

                 }
             }
         }
         for (var i = 0; i < redundantVertexVectors.length; ++i) {
             var vector = vertexVectors[redundantVertexVectors[i]];
             this.vertices.push(vector[0]);
             this.vertices.push(vector[1]);
             this.vertices.push(vector[2]);
         }
         this.uvs = uvs;
     },
     morphedVertexNormalsFromObj:function(){
         var vertexVectors=[];
         var normalVectors=[];

         for(var i=0;i<this.faces.length;i=i+1){
             if(!(this.faces[i].normal==undefined)&&this.faces[i].vertexNormals.length==0){
                 this.faces[i].vertexNormals["a"]=vec3.clone(this.faces[i].normal);
                 this.faces[i].vertexNormals["b"]=vec3.clone(this.faces[i].normal);
                 this.faces[i].vertexNormals["c"]=vec3.clone(this.faces[i].normal);
             }
             try{
             if(normalVectors[this.faces[i].a]===undefined)
             {
                 normalVectors[this.faces[i].a]=vec3.clone(this.faces[i].vertexNormals["a"]);
             }
             else{
                 vec3.add(normalVectors[this.faces[i].a],normalVectors[this.faces[i].a],this.faces[i].vertexNormals["a"])
             }
             if(normalVectors[this.faces[i].b]===undefined){
                 normalVectors[this.faces[i].b]=vec3.clone(this.faces[i].vertexNormals["b"]);
             }
             else{
                 vec3.add(normalVectors[this.faces[i].b],normalVectors[this.faces[i].b],this.faces[i].vertexNormals["b"])
             }
             if(normalVectors[this.faces[i].c]===undefined){
                 normalVectors[this.faces[i].c]=vec3.clone(this.faces[i].vertexNormals["c"]);
             }
             else{
                 vec3.add(normalVectors[this.faces[i].c],normalVectors[this.faces[i].c],this.faces[i].vertexNormals["c"])
             }
             }catch(e){
                 alert(e);
             }

         }
         this.normals=[];
         for(var j=0;j<normalVectors.length;j=j+1){
             vec3.normalize(normalVectors[j],normalVectors[j]);
             this.normals.push(normalVectors[j][0]);
             this.normals.push(normalVectors[j][1]);
             this.normals.push(normalVectors[j][2]);

         }


     },
     calculateVertexNormals:function(){
     var vertexVectors=[];
     var normalVectors=[];

     var j;
     for(var i=0;i<this.vertices.length;i=i+3){
         var vector=vec3.fromValues(this.vertices[i],this.vertices[i+1],this.vertices[i+2]);
         var normal=vec3.create();//Intiliazed normal array
         normalVectors.push(normal);
         vertexVectors.push(vector);
     }
     try{
         for(j=0;j<this.indices.length;j=j+3)//Since we are using triads of indices to represent one primitive
         {

             //v1-v0
             var vector1=vec3.create();
             vec3.subtract(vector1,vertexVectors[this.indices[j+1]],vertexVectors[this.indices[j]]);
             //v2-v1
             var vector2=vec3.create();
             vec3.subtract(vector2,vertexVectors[this.indices[j+2]],vertexVectors[this.indices[j+1]]);
             var normal=vec3.create();
             //cross product of two vector
             vec3.cross(normal, vector1, vector2);
             //Since the normal calculated from three vertices is same for all the three vertices(same face/surface), the contribution from each normal to the corresponding vertex  is the same
             vec3.add(normalVectors[this.indices[j]],normalVectors[this.indices[j]],normal);
             vec3.add(normalVectors[this.indices[j+1]],normalVectors[this.indices[j+1]],normal);
             vec3.add(normalVectors[this.indices[j+2]],normalVectors[this.indices[j+2]],normal);

         }
         }catch(e){
             alert(e);
         }
         for(var j=0;j<normalVectors.length;j=j+1){
         vec3.normalize(normalVectors[j],normalVectors[j]);
         this.normals.push(normalVectors[j][0]);
         this.normals.push(normalVectors[j][1]);
         this.normals.push(normalVectors[j][2]);

         }


     },
     clone:function(){
         var geometry=new Geometry();
         var i,j;
         for(i=0;i<this.vertices.length;++i){
             geometry.vertices[i]=this.vertices[i];
         }
         for(i=0;i<this.faces.length;++i){
             geometry.faces[i]=this.faces[i].clone();
         }
         for(i=0;i<this.uvs.length;++i){
             for(j=0;j<this.uvs[i].length;j) geometry.uvs[i][j]=this.uvs[i][j];
         }
         for(i=0;i<this.indices.length;++i){
             geometry.indices[i]=this.indices[i];
         }
         for(i=0;i<this.colors.length;++i){
             geometry.colors[i]=this.colors[i];
         }
         for(i=0;i<this.normals.length;++i){
             geometry.normals[i]=this.normals[i];
         }
         for(i=0;i<this.textureCoordinates.length;++i){
             geometry.textureCoordinates[i]=this.textureCoordinates[i];
         }
         for(i=0;i<this.faceUvs.length;++i){
             for(j=0;j<this.faceUvs[i].length;++j) geometry.faceUvs[i][j]=this.uvs[i][j];
         }
         for(i=0;i<this.faceVertexUvs.length;++i){
             for(j=0;j<this.faceVertexUvs[i].length;++j) geometry.faceVertexUvs[i][j]=this.faceVertexUvs[i][j];
         }
         geometry.materials=jQuery.extend(true, {}, this.materials);
         return geometry;
     }
 };


 Face = function ( a, b, c, normal, color, materialIndex ) {
     this.a = a;
     this.b = b;
     this.c = c;
     this.normal =  normal ;
     this.vertexNormals = [ ];
     this.vertexColors = color instanceof Array ? color : [];
     this.colorIndex = color;
     this.vertexTangents = [];
     this.materialIndex = materialIndex !== undefined ? materialIndex : 0;
 };
 Face.prototype = {

     constructor: Face,
     clone: function () {
         var face = new Face(this.a, this.b, this.c );
         if(!(this.normal===undefined))
         face.normal=vec3.clone(this.normal );
         face.colorIndex= this.colorIndex;
         face.materialIndex = this.materialIndex;
         var i;
         for ( i = 0; i < this.vertexNormals.length; ++i){

             face.vertexNormals[ i ] = vec3.clone(this.vertexNormals[ i ]);
         }
         for ( i = 0; i<this.vertexColors.length;++i ){
             face.vertexColors[ i ] = this.vertexColors[ i ];
         }
         return face;
     }

 };


class JSONMesh extends Mesh {

    /**
        @brief JSONMesh constructor
        @param [gl] webgl context
        @param [jsonData] the loaded json model object
    */
    constructor(gl, jsonData) {
        var geometry = JSONMesh.parseJSON(jsonData);
        var vertices = geometry.vertices;
        var indices = geometry.indices;
        var normals = geometry.normals;
        var uvs = null;
        if (geometry.uvs.length > 0) {
            uvs = geometry.uvs[0];
        }
        //console.log('geometry: ', geometry);
        // vertices, normals, and UVs
        const elementsPerVertex = 8;
        var combinedVertices = [];
        if (normals.length != vertices.length ||
            (uvs != null && uvs.length / 2 != vertices.length / 3))
        {
            Debug.Error("JSONMesh normals length != vertices length or uvs != vertices");
        }
        var uvCounter = 0;
        for (var i=0; i < vertices.length; i+=3) {
            combinedVertices.push(vertices[i+0]);
            combinedVertices.push(vertices[i+1]);
            combinedVertices.push(vertices[i+2]);
            combinedVertices.push(normals[i+0]);
            combinedVertices.push(normals[i+1]);
            combinedVertices.push(normals[i+2]);
            if (uvs != null) {
                combinedVertices.push(uvs[uvCounter+0]);
                combinedVertices.push(uvs[uvCounter+1]);
                uvCounter += 2;
            }
        }
        super(gl, combinedVertices, elementsPerVertex, indices);

        this.material = null;
        if (jsonData.materials.length > 0) {
            var dataMat = jsonData.materials[0];
            this.material = new Material(
                dataMat.colorAmbient,
                dataMat.colorDiffuse,
                dataMat.colorSpecular,
                dataMat.illumination
            );
        }
    }

    static isBitSet(value, position) {
        return value & ( 1 << position );
    }

    static parseJSON(data){
        var geometry=new Geometry();

        var i, j, fi,

            offset, zLength, nVertices,

            colorIndex, normalIndex, uvIndex, materialIndex,

            type,
            isQuad,
            hasMaterial,
            hasFaceUv, hasFaceVertexUv,
            hasFaceNormal, hasFaceVertexNormal,
            hasFaceColor, hasFaceVertexColor,

            vertex, face, color, normal,

            uvLayer, uvs, u, v,

            faces = data.faces,
            vertices = data.vertices,
            normals = data.normals,
            colors = data.colors,
            nUvLayers = 0;

        // disregard empty arrays

        for ( i = 0; i < data.uvs.length; i++ ) {
            if ( data.uvs[ i ].length ) nUvLayers ++;
        }
        for ( i = 0; i < nUvLayers; i++ ) {
            geometry.faceUvs[ i ] = [];
            geometry.faceVertexUvs[ i ] = [];
        }

        offset = 0;
        zLength = faces.length;

        while ( offset < zLength ) {
            type = faces[ offset ++ ];

            isQuad              = JSONMesh.isBitSet( type, 0 );
            hasMaterial         = JSONMesh.isBitSet( type, 1 );
            hasFaceUv           = JSONMesh.isBitSet( type, 2 );
            hasFaceVertexUv     = JSONMesh.isBitSet( type, 3 );
            hasFaceNormal       = JSONMesh.isBitSet( type, 4 );
            hasFaceVertexNormal = JSONMesh.isBitSet( type, 5 );
            hasFaceColor	      = JSONMesh.isBitSet( type, 6 );
            hasFaceVertexColor  = JSONMesh.isBitSet( type, 7 );

            if ( isQuad ) {
                face = new Face();

                face.a = faces[ offset ++ ];
                face.b = faces[ offset ++ ];
                face.c = faces[ offset ++ ];
                face.d=faces[ offset ++ ];

                nVertices = 4;
            } else {
                face = new Face();

                face.a = faces[ offset ++ ];
                face.b = faces[ offset ++ ];
                face.c = faces[ offset ++ ];

                nVertices = 3;
            }

            if ( hasMaterial ) {
                materialIndex = faces[ offset ++ ];
                face.materialIndex = materialIndex;
            }

            fi = geometry.faces.length;

            if ( hasFaceUv ) {
                for ( i = 0; i < nUvLayers; i++ ) {
                    uvLayer = data.uvs[ i ];
                    uvIndex = faces[ offset ++ ];
                    geometry.faceUvs[ i ][ fi ] = uvIndex;
                }
            }
            if ( hasFaceVertexUv ) {
                for ( i = 0; i < nUvLayers; i++ ) {
                    uvLayer = data.uvs[ i ];
                    uvs = [];
                    var aVertexIndices=["a","b","c","d"];
                    for ( j = 0; j < nVertices; j ++ ) {
                        uvIndex = faces[ offset ++ ];
                        uvs[ aVertexIndices[j] ] = uvIndex;
                    }
                    geometry.faceVertexUvs[ i ][ fi ] = uvs;
                }
            }

            if ( hasFaceNormal ) {
                normalIndex = faces[ offset ++ ] * 3;
                normal = vec3.fromValues(normals[ normalIndex ++ ],normals[ normalIndex ++ ],normals[ normalIndex ]);
                face.normal = normal;
            }

            if ( hasFaceVertexNormal ) {
                var aVertices=["a","b","c","d"];
                for ( i = 0; i < nVertices; i++ ) {
                    var aVertex=aVertices[i];
                    normalIndex = faces[ offset ++ ] * 3;
                    normal = vec3.fromValues(normals[ normalIndex ++ ],normals[ normalIndex ++ ],normals[ normalIndex ]);
                    face.vertexNormals[aVertex]= normal;

                }
            }

            if ( hasFaceColor ) {
                colorIndex = faces[ offset ++ ];
                face.colorIndex = colorIndex;
            }

            if ( hasFaceVertexColor ) {
                for ( i = 0; i < nVertices; i++ ) {
                    colorIndex = faces[ offset ++ ];
                    face.vertexColors.push( colorIndex );
                }
            }
            geometry.faces.push( face );
        }
        geometry.materials = data.materials;
        geometry.verticesFromFaceUvs(data.vertices,data.uvs,0);
        geometry.indicesFromFaces();

        if (geometry.vertices.length == 0){
            geometry.vertices=vertices;
        }
        if (data.normals.length>0){
            geometry.morphedVertexNormalsFromObj();
        }
        else{
            geometry.calculateVertexNormals();
        }

        return geometry;
    }
}
