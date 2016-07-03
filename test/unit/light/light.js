function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}
function start() {
  var canvas = document.getElementById('canvas');
  CanvasToy.setCanvas(canvas);

  var scene = new CanvasToy.Scene();
  var camera = new CanvasToy.PerspectiveCamera();

  var cube1 = new CanvasToy.CubeGeometry();
  var cube2 = new CanvasToy.CubeGeometry();

  var material1 = new CanvasToy.BRDFPerFragMaterial({
    color : vec3.fromValues(1, 1, 1),
    texture : new CanvasToy.Texture('../../images/chrome.png')
  });
  var mesh1 = new CanvasToy.Mesh(cube1, material1);

  var material2 = new CanvasToy.BRDFPerVertMaterial({
    // color : vec3.fromValues(1, 1, 1),
    texture : new CanvasToy.Texture('../../images/chrome.png')
  });
  var mesh2 = new CanvasToy.Mesh(cube2, material2);

  scene.ambientLight = vec3.fromValues(0.1, 0.1, 0.1);

  var light1 = new CanvasToy.PointLight();
  light1.diffuse = vec3.fromValues(0, 0, 0);
  light1.specular = vec3.fromValues(1, 1, 1);
  light1.idensity = 2;
  light1.position[2] = 10;
  scene.addLight(light1);
  // scene.addLight(light2);

  mesh1.translate(2, 0, -6.0);
  mesh2.translate(-2, 0, -6.0);

  var time = 0;

  mesh1.registerUpdate(() => {
    light1.position[2] += 0.1;
    // mesh1.rotateY(-1 / 300);
    // mesh2.rotateY(1 / 300);
  });

  // mesh.translate(100, 0, 0);

  // mesh.translate(100, 0, 0);

  scene.addObject(mesh1);
  scene.addObject(mesh2);
  CanvasToy.engine.startRender(scene, camera, 1000 / 60);
}
