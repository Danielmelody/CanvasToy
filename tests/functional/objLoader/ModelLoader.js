function start() {
  var canvas = document.getElementById('canvas');
  CanvasToy.setCanvas(canvas);
  var scene = new CanvasToy.Scene();
  var camera = new CanvasToy.PerspectiveCamera();
  scene.addObject(camera);
  scene.ambientLight = vec3.fromValues(0.2, 0.1, 0.1);
  var light = new CanvasToy.PointLight();
  // light.diffuse = CanvasToy.vec4.fromValues(0, 0, 0, 0);
  light.idensity = 1;
  light.position[2] = 100;
  light.position[0] = 100;
  light.diffuse = vec3.fromValues(1, 1, 1);
  light.specular = vec3.fromValues(0.3, 0.3, 0.3);

  var light2 = new CanvasToy.PointLight();
  light2.position[2] = 100;
  light2.position[0] = -100;
  light2.diffuse = vec3.fromValues(1, 0.5, 0.5);
  light2.specular = vec3.fromValues(1, 1, 1);
  scene.addLight(light2);
  scene.addLight(light);
  var red = new CanvasToy.BRDFPerFragMaterial({
    color : vec3.fromValues(1, 0, 0),
    texture : new CanvasToy.Texture2D('../images/chrome.png',
                                      CanvasToy.engine.gl.RGBA)
  });
  var green =
      new CanvasToy.BRDFPerFragMaterial({color : vec3.fromValues(0, 1, 0)});
  CanvasToy.OBJLoader.load('../models/teapot.obj', (object) => {
    scene.addObject(object);
    scene.addObject(camera);
    for (var i = 0; i < object.children.length; ++i) {
      object.children[i].materials = [ red, green ];
      red.uuid = 0;
      green.uuid = 1;
    }
    CanvasToy.engine.startRender(scene, camera, 1000 / 60);
    object.translate(0, 0, -40);
    var time = 0;
    object.rotateY(Math.PI / 2);
    // object.scale(0.1, 0.1, 0.1);
    object.registerUpdate(() => {
      time += 1 / 60
      object.rotateY(0.01);
      // object.translate(0, 0.03 * Math.cos(time / 2), 0);
    });
  });
}
