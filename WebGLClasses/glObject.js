/* Object class */

class glObject
{
    /*
     * Constructor 
     */
    constructor(vertices, itemSize, numItems)
    {
        /* Create the vertex buffer */
        this.vertexBuffer = this.createBuffer(gl.ARRAY_BUFFER, new Float32Array(vertices), itemSize, numItems);
    }

    /* 
     * Bind the buffers for drawing
     */
    bind(shader, modelViewMatrix) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(shader.vertexAttrib, this.vertexBuffer.itemSize, gl.FLOAT, false, 0,0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);

        if (this.texture !== undefined) {
            this.texture.use(shader.texCoordAttrib);
            gl.uniform1i(shader.samplerUniform, 0);
        }

        if (this._rotation !== undefined) {
            mat4.rotate(modelViewMatrix, this._rotation[0] * Math.PI / 180, [1, 0, 0]);
            mat4.rotate(modelViewMatrix, this._rotation[1] * Math.PI / 180, [0, 1, 0]);
            mat4.rotate(modelViewMatrix, this._rotation[2] * Math.PI / 180, [0, 0, 1]);
        }
        
    }

    /*
     * Draw either elements or arrays depending on what was given
     */
    draw(shader) {

        if (this.elementBuffer !== undefined) {
            gl.drawElements(gl.TRIANGLES, this.elementBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        }

        else {
            gl.drawArrays(gl.TRIANGLES, 0, this.vertexBuffer.numItems);
        }
    }

    /*
     * Create an element buffer
     */
    createElementBuffer(elements, itemSize, numItems) {
        this.elementBuffer = this.createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements), itemSize, numItems);
    }

    /*
     * Create a color buffer
     */
    createColorBuffer(colors, itemSize, numItems) {
        this.colorBuffer = this.createBuffer(gl.ARRAY_BUFFER, new Float32Array(colors), itemSize, numItems);
    }

    /*
     * Internal class function to create a gl buffer
     */
    createBuffer(type, data, itemSize, numItems) {
        var buffer = gl.createBuffer();
        
        gl.bindBuffer(type, buffer);
        gl.bufferData(type, data, gl.STATIC_DRAW);
        
        buffer.itemSize = itemSize;
        buffer.numItems = numItems;

        return buffer;
    }

    /*
     * Send a texture object for us to use
     */
    addTexture(texture) {
        this.texture = texture;
    }

    /*
     * Set a rotation vector
     */
    set rotation(rot) {
        this._rotation = rot;
    }

    /*
     * Get the rotation vector 
     */
    get rotation() {
        return this._rotation;
    }

    /*
     * Set a position vector
     */
    set position(pos) {
        this._position = pos;
    }

    /*
     * Get the position vector 
     */
    get position() {
        return this._position;
    }
};

