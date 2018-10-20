/* Fragment Shader 
 * storing in a string
 * is kind of a workaround to loading
 * text, otherwise would require AJAX or some sort */
var fragmentShaderText = 
`
precision mediump float;

// sent from the vertex shader
varying vec4 vColor;

void main(void) {
    gl_FragColor = vColor;
}
`;