/* Vertex Shader 
 * storing in a string
 * is kind of a workaround to loading
 * text, otherwise would require AJAX or some sort */
var vertexShaderText = 
`
attribute vec3 aVertexPosition;
attribute vec4 aVertexColor; // get the color vec from the program

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 vColor; // the vec to send to the fragment shader

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vColor = aVertexColor; // map the code color vec to our sending color vec
}
`;