function start() {
  var canvas = document.getElementById('canvas');
  CanvasToy.setCanvas(canvas);

  var scene = new CanvasToy.Scene();
  var camera = new CanvasToy.PerspectiveCamera();

  var node = new CanvasToy.Node();

  var mesh1 = new CanvasToy.Mesh(
      new CanvasToy.CubeGeometry(), new CanvasToy.BRDFPerFragMaterial({
        color : vec3.fromValues(1, 1, 1),
        texture : new CanvasToy.Texture('../../images/me.png')
      }));

  var mesh2 = new CanvasToy.Mesh(
      new CanvasToy.CubeGeometry(), new CanvasToy.BRDFPerVertMaterial({
        color : vec3.fromValues(1, 1, 1),
        texture : new CanvasToy.Texture('../../images/chrome.png')
      }));

  node.addChild(mesh1);
  node.addChild(mesh2)
  scene.addObject(node);
  scene.ambientLight = vec3.fromValues(0.2, 0.2, 0.2);
  var light = new CanvasToy.PointLight();
  light.idensity = 4;
  scene.addLight(light);

  mesh1.translate(2, 0, 0);
  mesh2.translate(-2, 0, 0);

  node.translate(0, 0, -10.0);

  mesh1.registerUpdate(() => { node.rotateY(0.01); });
  CanvasToy.engine.startRender(scene, camera, 1000 / 60);
}
