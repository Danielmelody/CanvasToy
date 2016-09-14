var canvas;
var source = document.getElementById('source');
var sourceTexture;

var triangleVertShader, triangleFragShader;

function allowDrop(ev) { ev.preventDefault(); }

function drop(ev) {
  ev.preventDefault();
  var newImg = ev.dataTransfer.files[0];
  var reader = new FileReader();
  reader.readAsDataURL(newImg);
  reader.addEventListener('loadend', function(e) { source.src = this.result; });
  return false;
}

function loadResources() {
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

function createSmoothGeometry(randomVerticles, triangles) {
    var geometry = new CanvasToy.Geometry();
    geometry.faces = triangles;
    for (var i = 0; i < randomVerticles.length; ++i) {
        geometry.positions.push(randomVerticles[i][0] * 2 - 1);
        geometry.positions.push(randomVerticles[i][1] * 2 - 1);
        geometry.positions.push(0);
        geometry.uvs.push(randomVerticles[i][0]);
        geometry.uvs.push(randomVerticles[i][1]);
    }
    return geometry;
}

function createFlatGeometry(randomVerticles, triangles) {
  var geometry = new CanvasToy.Geometry();
  for (var i = 0; i < triangles.length; i += 3) {
    var averageX = (randomVerticles[triangles[i]][0] +
                    randomVerticles[triangles[i + 1]][0] +
                    randomVerticles[triangles[i + 2]][0]) /
                   3;
    var averageY = (randomVerticles[triangles[i]][1] +
                    randomVerticles[triangles[i + 1]][1] +
                    randomVerticles[triangles[i + 2]][1]) /
                   3;
    for (var j = i; j < i + 3; ++j) {
      geometry.positions.push(randomVerticles[triangles[j]][0] * 2 - 1);
      geometry.positions.push(randomVerticles[triangles[j]][1] * 2 - 1);
      geometry.positions.push(0);
      geometry.uvs.push(averageX);
      geometry.uvs.push(averageY);
      geometry.faces.push(j);
    }
  }
  return geometry;
}

function render() {
  canvas.width = source.width;
  canvas.height = source.height;
  CanvasToy.setCanvas(canvas);
  var rttScene = new CanvasToy.Scene();
  var rttCamera = new CanvasToy.PerspectiveCamera();
  rttCamera.fovy = 45;
  var gl = CanvasToy.engine.gl;
  sourceTexture = new CanvasToy.Texture2D(source);
  var triangleFaceMaterial = new CanvasToy.Material(
      {texture : sourceTexture, color : vec3.fromValues(1, 1, 1)});
  triangleFaceMaterial.vertexShaderSource = triangleVertShader;
  triangleFaceMaterial.fragShaderSource = triangleFragShader;


  var randomVerticles = [];
  randomVerticles.push([ 0, 0 ]);
  randomVerticles.push([ 0, 1 ]);
  randomVerticles.push([ 1, 0 ]);
  randomVerticles.push([ 1, 1 ]);
  for (var i = 0; i < 3000; ++i) {
    randomVerticles.push([ Math.random(), Math.random() ]);
  }
  var triangles = Delaunay.triangulate(randomVerticles);


  var meshGeometry = createSmoothGeometry(randomVerticles, triangles);
  console.log(meshGeometry);
  var rect = new CanvasToy.Mesh(meshGeometry, [ triangleFaceMaterial ]);
  rect.translate(0, 0, -1.0);
  rttScene.addObject(rect);
  rttScene.addObject(rttCamera);
  rect.registUpdate(() => { rect.translate(0, 0, 0); });
  CanvasToy.engine.render(rttScene, rttCamera);
}

source.onload = () => {
  console.log('source reload');
  document.getElementById('container').innerHTML = '';
  CanvasToy.engine = null;
  canvas = document.createElement('canvas');
  document.getElementById('container').appendChild(canvas);
  loadResources();
};
