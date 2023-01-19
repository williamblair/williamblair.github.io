// global vars
var render = null;
var timer = null;
var shader = null;
var camera = null;
var cube = null;
var cubeTex = null;
var projMat = mat4.create();
var viewMat = mat4.create();
var modelMat = mat4.create();

var vertexShaderText = `#version 300 es
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec2 aTexCoord;

uniform mat4 uProjMat;
uniform mat4 uViewMat;
uniform mat4 uModelMat;

out vec2 vTexCoord;

void main()
{
    vTexCoord = aTexCoord;
    gl_Position = uProjMat * uViewMat * uModelMat * vec4(aPosition,1.0);
}
`;
var fragmentShaderText = `#version 300 es
precision mediump float;

uniform sampler2D uTexture;

in vec2 vTexCoord;

out vec4 FragColor;

void main()
{
    FragColor = texture(uTexture, vTexCoord);
}
`;

function makeCube() {
    var vertices = [
      // pos      norm    uv
      // front
      -1, -1, 1,  0,0,1,  0,0,
      1, -1, 1,   0,0,1,  1,0,
      1, 1, 1,    0,0,1,  1,1,
      -1, -1, 1,  0,0,1,  0,0,
      1, 1, 1,    0,0,1,  1,1,
      -1, 1, 1,   0,0,1,  0,1,

      // back
      -1, -1, -1, 0,0,-1, 1,0, 
      1, -1, -1,  0,0,-1, 0,0,
      1, 1, -1,   0,0,-1, 0,1,
      -1, -1, -1, 0,0,-1, 1,0,
      1, 1, -1,   0,0,-1, 0,1,
      -1, 1, -1,  0,0,-1, 1,1,

      // left
      -1, -1, -1, -1,0,0, 0,0,
      -1, -1, 1,  -1,0,0, 1,0,
      -1, 1, 1,   -1,0,0, 1,1,
      -1, -1, -1, -1,0,0, 0,0,
      -1, 1, 1,   -1,0,0, 1,1,
      -1, 1, -1,  -1,0,0, 0,1,

      // right
      1, -1, -1,  1,0,0,  1,0,
      1, -1, 1,   1,0,0,  0,0,
      1, 1, 1,    1,0,0,  0,1,
      1, -1, -1,  1,0,0,  1,0,
      1, 1, 1,    1,0,0,  0,1,
      1, 1, -1,   1,0,0,  1,1,

      // top
      -1, 1, 1,   0,1,0,  0,0,  
      1, 1, 1,    0,1,0,  1,0,
      1, 1, -1,   0,1,0,  1,1,
      -1, 1, 1,   0,1,0,  0,0,
      1, 1, -1,   0,1,0,  1,1,
      -1, 1, -1,  0,1,0,  0,1,

      // bottom
      -1, -1, 1,  0,-1,0, 0,0,
      1, -1, 1,   0,-1,0, 1,0,
      1, -1, -1,  0,-1,0, 1,1,
      -1, -1, 1,  0,-1,0, 0,0,
      1, -1, -1,  0,-1,0, 1,1,
      -1, -1, -1, 0,-1,0, 0,1
    ];
    return new Mesh(
        render.gl,
        vertices,
        3+3+2,
        null,
        render.gl.STATIC_DRAW
    );
}
function mainLoop()
{
    camera.Update(timer.dt / 1000.0);
    timer.Update();
    mat4.rotate(modelMat, modelMat, timer.dt*0.0005, [1.0,0.0,0.3]);

    render.BeginFrame();
        cubeTex.Use();
        shader.SetMatrixUniform(Shader.PERSPECTIVE_MAT_UNIFORM, render.perspectiveMatrix);
        shader.SetMatrixUniform(Shader.VIEW_MAT_UNIFORM, camera.viewMatrix);
        shader.SetMatrixUniform(Shader.MODEL_MAT_UNIFORM, modelMat);
        render.DrawMesh(cube);
    render.EndFrame();

    window.requestAnimationFrame(mainLoop);
}
function main()
{
    render = new Renderer("myCanvas");
    render.SetClearColor([0.0, 0.0, 0.0, 0.0]);
    timer = new LoopTimer("fpsSpan");
    shader = new Shader(
        render.gl,
        vertexShaderText,
        fragmentShaderText
    );
    shader.Use();
    camera = new FPSCamera();
    cubeTex = new Texture(render.gl, "CubeTexture");
    cube = makeCube();
    mat4.translate(modelMat,modelMat,[0,0,0.0]);

    mainLoop();
}

