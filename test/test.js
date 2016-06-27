function start() {
  var canvas = document.getElementById('canvas');
  CanvasToy.setCanvas(canvas);

  var scene = new CanvasToy.Scene();
  var camera = new CanvasToy.PerspectiveCamera();

  var logo = new CanvasToy.Texture('images/chrome.png');

  var rect = new CanvasToy.RectGeomotry();
  var material = new CanvasToy.BRDFPerFragMaterial({texture : logo});

  var mesh = new CanvasToy.Mesh(rect, material);

  var angle = 0.01;

  mesh.translate(0, 0, -6.0);
  // mesh.rotateY(20);

  mesh.registerUpdate(() => {
    // mesh.translate(0, 0, 0);
    mesh.rotateX(angle);
    // console.log(mesh.modelViewMatrix);
  });

  // mesh.translate(100, 0, 0);

  // mesh.translate(100, 0, 0);

  scene.addObject(mesh);

  CanvasToy.engine.startRender(scene, camera, 1000 / 60);
}
