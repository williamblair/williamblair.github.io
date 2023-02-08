/* GLTF Mesh */
class GLTFMesh extends Mesh {
    /**
        @brief GLTFMesh constructor
        @param [gl] webgl instance
        @param [data] JSON gltf data
        @param [scale] amount to scale the size by (default=1.0)
    */
    constructor(gl, data, scale = 1.0) {

        console.log('GLTF constructor data: ', data);
        console.log('Mesh0: name: ', data.meshes[0].name);

        var vertsObj = GLTFMesh.getVertices(data, scale);
        var normals = GLTFMesh.getNormals(data);

        console.log('GLTFMesh vertices, normals: ', vertsObj, normals);

        if (vertsObj.vertices.length != normals.length) {
            Debug.Error('GLTFMesh constructor vert len != norm len');
            return;
        }

        var resultVertices = [];
        for (var i = 0; i < vertsObj.vertexCount*3; i += 3) {
            resultVertices.push(vertsObj.vertices[i+0]);
            resultVertices.push(vertsObj.vertices[i+1]);
            resultVertices.push(vertsObj.vertices[i+2]);
            resultVertices.push(normals[i+0]);
            resultVertices.push(normals[i+1]);
            resultVertices.push(normals[i+2]);
        }
        console.log('GLTFMesh result vertices: ', resultVertices);

        const elementsPerVertex = 6;
        super(gl, resultVertices, elementsPerVertex, null);
    }

    static getVertices(data, scale) {
        // each attribute is defined by mapping the attribute name to
        // the index of the accessor which contains the attribute data
        var positionAccessor = data.accessors[
            data.meshes[0].primitives[0].attributes.POSITION
        ];
        var vertexCount = positionAccessor.count;
        console.log('GLTFMesh getVertices vertex count: ', vertexCount);

        var positionBufferView = data.bufferViews[
            positionAccessor.bufferView
        ];
        var positionBuffer = data.buffers[positionBufferView.buffer];

        // https://gist.github.com/sketchpunk/f5fa58a56dcfe6168a9328e7c32a4fd4
        const stringStartIndex =  "data:application/octet-stream;base64,".length;
        var base64str = positionBuffer.uri.substring(stringStartIndex)
        var blob = window.atob(base64str);
        var fLen = blob.length / Float32Array.BYTES_PER_ELEMENT;
        var dView = new DataView(new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT));
        var vertices = new Float32Array(fLen);

        var p = 0;
        for (var j = 0; j < fLen; ++j) {
            p = j * 4;
            dView.setUint8(0,blob.charCodeAt(p+0));
            dView.setUint8(1,blob.charCodeAt(p+1));
            dView.setUint8(2,blob.charCodeAt(p+2));
            dView.setUint8(3,blob.charCodeAt(p+3));
            vertices[j] = dView.getFloat32(0,true) * scale;
        }

        return {vertices: vertices, vertexCount: vertexCount};
    }

    static getNormals(data) {
        var normalAccessor = data.accessors[
            data.meshes[0].primitives[0].attributes.NORMAL
        ];
        var normalBufferView = data.bufferViews[
            normalAccessor.bufferView
        ];
        var normalBuffer = data.buffers[normalBufferView.buffer];
        const stringStartIndex = "data:application/octet-stream;base64,".length;
        var base64str = normalBuffer.uri.substring(stringStartIndex);
        var blob = window.atob(base64str);
        var fLen = blob.length / Float32Array.BYTES_PER_ELEMENT;
        var dView = new DataView(new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT));
        var normals = new Float32Array(fLen);

        var p = 0;
        for (var j = 0; j < fLen; ++j) {
            p = j * 4;
            dView.setUint8(0,blob.charCodeAt(p+0));
            dView.setUint8(1,blob.charCodeAt(p+1));
            dView.setUint8(2,blob.charCodeAt(p+2));
            dView.setUint8(3,blob.charCodeAt(p+3));
            normals[j] = dView.getFloat32(0,true);
        }
        return normals;
    }
}
