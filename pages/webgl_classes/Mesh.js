/*
 * Mesh class - creates and wraps vertices, indices, and their buffers
 *
 * Assumed shader locations are below, and vertices contains one,two, or three of these
 */
const POS_ATTR_LOC = 0;
const NORM_ATTR_LOC = 1;
const UV_ATTR_LOC = 2;
class Mesh {
    /**
        @brief Mesh constructor
        @param [gl] webgl context
        @param [vertices] normal JS array of vertices (will be internally converted to Float32Array)
        @param [elementsPerVertex] how many floats in the vertices array per vertex (e.g. 3 if just x,y,z values)
        @param [indices] normal JS array of indices (can be null/undefined if unused)
    */
    constructor(
        gl, 
        vertices, 
        elementsPerVertex,
        indices,
        staticDynamicDraw
    )
    {
        this.gl = gl;
        this.numVertices = 0;
        this.numIndices = 0;
        this.drawMode = this.gl.TRIANGLES;
        if (!vertices) {
            Debug.Error("Mesh Constructor: invalid vertices");
        }
        this.numVertices = vertices.length / elementsPerVertex;
        this.elementsPerVertex = elementsPerVertex;
        if (indices != null && indices != undefined) {
            this.numIndices = indices.length;
        }
        else {
            this.numIndices = 0;
        }

        this.createVAO(vertices, elementsPerVertex, indices, staticDynamicDraw);
    }

    createVAO(vertices, elementsPerVertex, indices, staticDynamicDraw) {
        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);

        if (staticDynamicDraw !== this.gl.DYNAMIC_DRAW) {
            staticDynamicDraw = this.gl.STATIC_DRAW;
        }

        this.vbo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(vertices),
            staticDynamicDraw
        ); // TODO - not hardcode STATIC_DRAW

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
        if (this.numIndices > 0) {
            this.ebo = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ebo);
            this.gl.bufferData(
                this.gl.ELEMENT_ARRAY_BUFFER,
                new Uint32Array(indices),
                this.gl.STATIC_DRAW
            );
        }
        else {
            this.ebo = undefined;
        }

        // position vertex array attrib
        this.gl.enableVertexAttribArray(POS_ATTR_LOC);
        this.gl.vertexAttribPointer(
            POS_ATTR_LOC,                           // index
            3,                                      // size
            this.gl.FLOAT,                          // type
            false,                                  // normalized?
            this.elementsPerVertex * Float32Array.BYTES_PER_ELEMENT, // stride
            0                                       // offset
        );

        // implies has both position and normals
        if (this.elementsPerVertex >= 6) {
            this.gl.enableVertexAttribArray(NORM_ATTR_LOC);
            this.gl.vertexAttribPointer(
                NORM_ATTR_LOC,                          // index
                3,                                      // size
                this.gl.FLOAT,                          // type
                false,                                  // normalized?
                this.elementsPerVertex * Float32Array.BYTES_PER_ELEMENT, // stride
                3 * Float32Array.BYTES_PER_ELEMENT      // offset
            );
        }

        // implies has position, normals, and tex coords
        if (this.elementsPerVertex >= 8) {
            this.gl.enableVertexAttribArray(UV_ATTR_LOC);
            this.gl.vertexAttribPointer(
                UV_ATTR_LOC,                            // index
                2,                                      // size
                this.gl.FLOAT,                          // type
                false,                                  // normalized?
                this.elementsPerVertex * Float32Array.BYTES_PER_ELEMENT, // stride
                6 * Float32Array.BYTES_PER_ELEMENT      // offset
            );
        }

        this.gl.bindVertexArray(null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        if (this.numIndices > 0) {
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        }
    }
    
    updateVertices(vertsFloat32) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
        this.gl.bufferSubData(
            this.gl.ARRAY_BUFFER,
            0,
            vertsFloat32
        );
    }
}

