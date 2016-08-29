function start() {
  var canvas = document.getElementById('canvas');
  CanvasToy.setCanvas(canvas);
  var scene = new CanvasToy.Scene();
  var camera = new CanvasToy.PerspectiveCamera();
  scene.addObject(camera);
  scene.ambientLight = vec3.fromValues(0.2, 0.1, 0.1);
  var light = new CanvasToy.PointLight();
  // light.diffuse = CanvasToy.vec4.fromValues(0, 0, 0, 0);
  light.idensity = 0.8;
  light.position[2] = 100;
  light.position[0] = 100;
  light.diffuse = vec3.fromValues(0, 0.5, 1);
  light.specular = vec3.fromValues(1, 1, 1);

  var light2 = new CanvasToy.PointLight();
  light2.position[2] = 100;
  light2.position[0] = -100;
  light2.diffuse = vec3.fromValues(1, 0.5, 0.5);
  light2.specular = vec3.fromValues(1, 1, 1);
  scene.addLight(light2);
  scene.addLight(light);
  CanvasToy.OBJLoader.load('../../models/UniqueStudio.obj', (object) => {
    scene.addObject(object);
    scene.addObject(camera);
    for (var i = 0; i < object.children.length; ++i) {
      object.children[i].material.shadingMode =
          CanvasToy.ShadingMode.flatShading;
    }
    CanvasToy.engine.startRender(scene, camera, 1000 / 60);
    object.translate(0, 0, -40);
    var time = 0;
    object.rotateY(Math.PI / 2);
    object.scale(0.1, 0.1, 0.1);
    object.registerUpdate(() => {
      time += 1 / 60;
      light.position[1] += 3 * Math.cos(time * 2);
      object.rotateY(0.01);
      // object.translate(0, 0.03 * Math.cos(time / 2), 0);
    });
  });
}
