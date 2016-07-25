function start() {
  var canvas = document.getElementById('canvas');
  CanvasToy.setCanvas(canvas);
  var scene = new CanvasToy.Scene();
  var camera = new CanvasToy.PerspectiveCamera();
  scene.ambientLight = vec3.fromValues(0.2, 0.1, 0.1);
  var light = new CanvasToy.PointLight();
  // light.diffuse = CanvasToy.vec4.fromValues(0, 0, 0, 0);
  light.indensity = 4;
  // light.diffuse = vec3.fromValues(0, 0, 0);
  // light.specular = vec3.fromValues(0, 0, 0);
  scene.addLight(light);
  CanvasToy.OBJLoader.load('../../models/teapot.obj', (object) => {
    scene.addObject(object);
    CanvasToy.engine.startRender(scene, camera, 1000 / 60);
    object.translate(0, 0, -30);
    object.registerUpdate(() => {object.rotateY(0.01)});
  });
}
