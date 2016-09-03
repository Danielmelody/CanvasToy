function start() {
  var canvas = document.getElementById('canvas');
  CanvasToy.setCanvas(canvas);

  var scene = new CanvasToy.Scene();
  var camera = new CanvasToy.PerspectiveCamera();

  var image = new Image();
  image.src = '../images/sea.jpg';

  var cube = new CanvasToy.Mesh(
      new CanvasToy.CubeGeometry(), new CanvasToy.BRDFPerFragMaterial({
        color : vec3.fromValues(1, 1, 1),
        texture : new CanvasToy.Texture2D(image, CanvasToy.engine.gl.RGBA)
      }));
  cube.translate(0, 0, -6.0);
  scene.addObject(cube);
  scene.addObject(camera);

  scene.ambientLight = vec3.fromValues(0.1, 0.1, 0.1);
  var light = new CanvasToy.PointLight();
  scene.addLight(light);

  cube.registerUpdate(() => { cube.rotateY(0.01); });
  CanvasToy.engine.startRender(scene, camera, 1000 / 60);
}