/* Fragment Shader 
 * storing in a string
 * is kind of a workaround to loading
 * text, otherwise would require AJAX or some sort */
var fragmentShaderText = 
`
precision mediump float;

void main(void) {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`;