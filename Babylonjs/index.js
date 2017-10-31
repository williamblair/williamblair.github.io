/* Babylon.js */

/* get the canvas to draw on */
var canvas = document.getElementById('mycanvas');

/* initialize a babylon engine */
var engine = new BABYLON.Engine(canvas, true);

/* defines what to draw */
var createScene = function() {
  /* initialize a new scene */
  var scene = new BABYLON.Scene(engine);

  /* add a camera */
  var camera = new BABYLON.ArcRotateCamera(
    "camera", 
    Math.PI / 2, Math.PI / 2, 
    2, 
    BABYLON.Vector3.Zero(), 
    scene
  );

  /* Add lights to the scene */
  var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
  var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

  /* Add a sphere to the scene */
  var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:2}, scene);

  /* return the scene with all of our new additions */
  return scene;
};

/* Get our scene object */
var scene = createScene();

/* tell babylon to draw our scene when the engine is running */
engine.runRunderLoop(function() {
  scene.render();
});

/* Automatically resize if the window resizes */
window.addEventListener("resize", function() {
  engine.resize();
});

