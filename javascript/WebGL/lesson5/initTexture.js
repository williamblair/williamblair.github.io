/* loads the given texture */
var myTexture;
var initTexture = function() {
  
  /* initialize a new WebGL texture */
  myTexture = gl.createTexture();
  
  /* Give it a new html image element */
  myTexture.image = new Image();

  /* After loading the image, do WebGL stuff with it */
  myTexture.image.onload = function() {
    handleLoadedTexture(myTexture);
  };

  /* set the source as to start and load the image */
  myTexture.image.src = "images/myimage.jpg";
};

var handleLoadedTexture = function(texture) {

  /* tell opengl which texture we're working on */
  gl.bindTexture(gl.TEXTURE_2D, texture);

  /* tell opengl the texture needs to be flipped vertically */
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  /* specify details about the image */
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);

  /* tell opengl how we want it to handle scaling the image (near/far) */
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

  /* unbind the texture */
  gl.bindTexture(gl.TEXTURE_2D, null);
}
