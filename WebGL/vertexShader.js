/* Vertex Shader 
 * storing in a string
 * is kind of a workaround to loading
 * text, otherwise would require AJAX or some sort */
var vertexShaderText = 
`
attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
`;