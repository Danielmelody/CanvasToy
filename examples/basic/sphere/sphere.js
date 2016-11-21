function start() {
  var canvas = document.getElementById('canvas');
  CanvasToy.setCanvas(canvas);

  var scene = new CanvasToy.Scene();
  var camera = new CanvasToy.PerspectiveCamera();

  var logo = new CanvasToy.Texture('../../images/chrome.png');
  var sphere = new CanvasToy.SphereGeometry(1, 0.1);
  var material = new CanvasToy.Material({mainTexture : logo});
  var mesh = new CanvasToy.Mesh(sphere, material);

  // scene.ambientLight = vec3.fromValues(0.1, 0.1, 0.1);

  var light = new CanvasToy.PointLight();
  light.diffuse = vec3.fromValues(0.1, 0.1, 0.1);
  light.specular = vec3.fromValues(0.1, 0.1, 0.1);
  light.idensity = 0.5;
  scene.addLight(light);
  var angle = 0.01;
  mesh.translate([ 0, 0, -6.0 ]);
  var time = 0;
  mesh.rotateX(1);
  mesh.registerUpdate(() => {
    time += 1 / 60;
    mesh.rotateX(Math.sin(1 / 60));
    mesh.rotateY(Math.sin(1 / 60));
  });
  scene.addObject(mesh);
  CanvasToy.engine.startRender(scene, camera, 1000 / 60);
}
