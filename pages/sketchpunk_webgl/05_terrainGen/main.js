// globals
var gl;

var camera = null;
var cameraCtrl = null;

var shader = null;
var model = null;
var model2 = null;
var mDebug = null;

var gridFloor = null;


var rendLoop;
function onRender(dt) {

    gl.fClear();

    camera.updateViewMatrix();
    gridFloor.render(camera);

    shader.preRender("uCameraMatrix", camera.viewMatrix)
        .renderModel(model.preRender(),false);

    mDebug.render(camera);
}

// Called by Resources when all assets have been loaded
function onReady() {
    shader = new ShaderBuilder(gl, "vertexShader", "fragmentShader")
        .prepareUniforms(
          "uPMatrix", "mat4",
          "uMVMatrix", "mat4",
          "uCameraMatrix", "mat4",
        ).setUniforms(
          "uPMatrix", camera.projectionMatrix
        );

    model = Terrain.createModel(gl, true);

    mDebug = new LineDebugger(gl);
    mDebug.addColor("#00FF00")
        .addMeshNormal(0.0, 0.3, model.mesh)
        .finalize();

    // start drawing frames now
    rendLoop.start();
}

// called by body onload automatically
function main() {
    gl = GLInstance("mycanvas")
        .fFitScreen(0.95,0.9)
        .fClear();

    camera = new Camera(gl);
    camera.transform.position.set(0,1,3);
    cameraCtrl = new CameraController(gl, camera);

    gridFloor = new GridFloor(gl);
    rendLoop = new RenderLoop(onRender);

    // no resources to load
    onReady();
}
