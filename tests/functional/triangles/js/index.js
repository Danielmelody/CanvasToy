var canvas = document.getElementById('canvas');
var source = document.getElementById('source');

var triangleVertShader, triangleFragShader;

function getShaderSources() {
  var request1 = new XMLHttpRequest();
  request1.open('GET', 'shader/triangles.vert');
  request1.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      triangleVertShader = this.responseText;
      if (!!triangleFragShader) {
        render();
      }
    }
  };
  request1.send();

  var request2 = new XMLHttpRequest();
  request2.open('GET', 'shader/triangles.frag');
  request2.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      triangleFragShader = this.responseText;
      if (!!triangleFragShader) {
        render();
      }
    }
  };
  request2.send();
}

function render() {
  canvas.width = source.width;
  canvas.height = source.height;
  CanvasToy.setCanvas(canvas);
  var scene = new CanvasToy.Scene();
  var camera = new CanvasToy.PerspectiveCamera();
  camera.fovy = 45;
  var gl = CanvasToy.engine.gl;
  var triangleFaceMaterial = new CanvasToy.Material({
    texture : new CanvasToy.Texture2D(source.src),
    color : vec3.fromValues(1, 1, 1)
  });
  triangleFaceMaterial.vertexShaderSource = triangleVertShader;
  triangleFaceMaterial.fragShaderSource = triangleFragShader;

  var rect = new CanvasToy.Mesh(new CanvasToy.RectGeomotry(),
                                [ triangleFaceMaterial ]);
  rect.translate(0, 0, -1.0);
  scene.addObject(rect);
  scene.addObject(camera);
  rect.registerUpdate(() => { rect.translate(0, 0, 0); });
  CanvasToy.engine.startRender(scene, camera, 1000 / 60);
}

source.onload = () => { getShaderSources(); };
