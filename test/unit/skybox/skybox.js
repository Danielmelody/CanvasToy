function start() {
  var canvas = document.getElementById('canvas');
  CanvasToy.setCanvas(canvas);

  var scene = new CanvasToy.Scene();
  var camera = new CanvasToy.PerspectiveCamera();
  scene.addObject(camera);

  var cubeTexture = new CanvasToy.CubeTexture(
      "images/xneg.jpg", "images/xpos.jpg", "images/ypos.jpg",
      "images/ypos.jpg", "images/xneg.jpg", "images/zpos.jpg",
      CanvasToy.engine.gl.RGB);
  var texture2D = new CanvasToy.Texture2D('../../images/chrome.png',
                                          CanvasToy.engine.gl.RGBA);
  var light = new CanvasToy.PointLight();
  light.idensity = 4;
  scene.addLight(light);
  var cube = new CanvasToy.Mesh(
      new CanvasToy.CubeGeometry(),
      new CanvasToy.BRDFPerFragMaterial({texture : texture2D}));
  cube.translate(0, 0, -6);
  scene.ambientLight = vec3.fromValues(0.2, 0.2, 0.2);
  scene.addObject(cube);
  CanvasToy.engine.startRender(scene, camera, 1000 / 60);
}
