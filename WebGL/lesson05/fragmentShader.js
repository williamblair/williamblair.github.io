/* Fragment Shader 
 * storing in a string
 * is kind of a workaround to loading
 * text, otherwise would require AJAX or some sort */
var fragmentShaderText = 
`
precision mediump float;

// sent from the vertex shader
varying vec2 vTextureCoord;

uniform sampler2D uSampler; // the sampler we specified to use in drawScene

void main(void) {
    gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)); // s/t are the texture equivalents of x/y
}
`;