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
    UBO.Cache["MatTransform"].update("matCameraView", camera.viewMatrix);

    gridFloor.render(camera);
    shader.preRender()
        .renderModel(model.preRender(),false);

    mDebug.render(camera);
}

// Called by Resources when all assets have been loaded
function onReady() {
    shader = new ShaderBuilder(gl, "vertexShader", "fragmentShader")
        .prepareUniforms(
          "uMVMatrix", "mat4" // only model matrix is regular uniform
        ).prepareUniformBlocks(
          // remainder of matrices in UBO
          UBO.Cache["MatTransform"], 0 // block index 0
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

    // block point 1 (however, can and is better to start with 0)
    UBO.create(gl, "MatTransform", 1, [

      {name:"matProjection", type:"mat4"},
      {name:"matCameraView", type:"mat4"}

      // example data
      /*{name:"float01", type:"f"},
      {name:"vec3", type:"vec3"}
      {name:"float03", type:"f"},
      {name:"matProj", type:"mat3"},
      {name:"float04", type:"f"},
      {name:"float05", type:"f"},
      {name:"vec3", type:"vec3"},
      {name:"float06", type:"f"}*/
    ]);
    UBO.Cache["MatTransform"].update("matProjection", camera.projectionMatrix);

    // no resources to load
    onReady();
}
