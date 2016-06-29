function start() {
  var canvas = document.getElementById('canvas');
  CanvasToy.setCanvas(canvas);

  var scene = new CanvasToy.Scene();
  var camera = new CanvasToy.PerspectiveCamera();

  var logo = new CanvasToy.Texture('../../images/chrome.png');
  var rect = new CanvasToy.RectGeomotry();
  var material = new CanvasToy.BRDFPerFragMaterial({texture : logo});
  var mesh = new CanvasToy.Mesh(rect, material);

  scene.ambientLight = vec3.fromValues(0.1, 0.1, 0.1);

  var light = new CanvasToy.PointLight();
  light.diffuse = vec3.fromValues(0.5, 0.5, 0.5);
  light.specular = vec3.fromValues(0.5, 0.5, 0.5);

  scene.addLight(light);

  var angle = 0.01;
  mesh.translate(0, 0, -6.0);

  mesh.registerUpdate(() => {
    // mesh.translate(0, 0, 0);
    mesh.rotateX(angle);
  });

  // mesh.translate(100, 0, 0);

  // mesh.translate(100, 0, 0);

  scene.addObject(mesh);
  CanvasToy.engine.startRender(scene, camera, 1000 / 60);
}
