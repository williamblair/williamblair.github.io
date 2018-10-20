/* Texture class */

class Texture
{
    /* 
     * Constructor 
     */
    constructor(imageID, texCoords, coordItemSize, coordNumItems)
    { 
        /* Init a new texture in WebGL */
        this.texture = gl.createTexture();
        this.texture.image = document.getElementById(imageID);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        /* Set the image data */
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D (
                gl.TEXTURE_2D, 0, 
                gl.RGBA, gl.RGBA, 
                gl.UNSIGNED_BYTE, 
                this.texture.image
            );

        /* Set rendering options */
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        /* Unbind the texture */
        gl.bindTexture(gl.TEXTURE_2D, null);

        /* Create the texture buffer */
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData (
                gl.ARRAY_BUFFER, 
                new Float32Array(texCoords), 
                gl.STATIC_DRAW
            );

        this.itemSize = coordItemSize;
        this.numItems = coordNumItems;
    }

    /*
     * Bind and use our texture/buffer, given the texture coordinate
     * attribute from the shader
     */
    use(texCoordAttrib) {
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        gl.vertexAttribPointer (
                texCoordAttrib, 
                this.itemSize, 
                gl.FLOAT, 
                false,
                0, 0
            );

        /* THIS PROBABLY NEEDS TO CHANGED ASSUMING WE HAVE MULT TEXTURES */
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }

};

