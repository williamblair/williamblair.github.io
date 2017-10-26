/* Vertex Shader 
 * storing in a string
 * is kind of a workaround to loading
 * text, otherwise would require AJAX or some sort */
var vertexShaderText = 
`
attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 vColor;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vColor = aVertexColor;
}
`;