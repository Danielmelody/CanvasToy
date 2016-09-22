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
    geometry.addVertex({
      position : [
        randomVerticles[triangles[j]][0] * 2 - 1,
        randomVerticles[triangles[j]][1] * 2 - 1
      ],
      uv : randomVerticles[i]
    });
  }
  return geometry;
}

function createFlatGeometry(randomVerticles, triangles) {
  var geometry = new CanvasToy.Geometry();
  geometry.removeAttribute('normal');
  geometry.removeAttribute('flatNormal');
  geometry.setAttribute(
      'triangleUV1',
      new CanvasToy.Attribute(
          {type : CanvasToy.DataType.float, size : 2, data : []}));
  geometry.setAttribute(
      'triangleUV2',
      new CanvasToy.Attribute(
          {type : CanvasToy.DataType.float, size : 2, data : []}));
  for (var i = 0; i < triangles.length; i += 3) {
    for (var j = i; j < i + 3; ++j) {
      var indices = [ i, i + 1, i + 2 ];
      indices.splice(j - i, 1);
      geometry.addVertex({
        position : [
          randomVerticles[triangles[j]][0] * 2 - 1,
          randomVerticles[triangles[j]][1] * 2 - 1, 0
        ],
        uv : [
          randomVerticles[triangles[j]][0], randomVerticles[triangles[j]][1]
        ],
        triangleUV1 : randomVerticles[triangles[indices[0]]],
        triangleUV2 : randomVerticles[triangles[indices[1]]]
      });
      geometry.faces.data.push(j);
    }
  }
  console.log(geometry);
  return geometry;
}

function render() {
  canvas.width = source.width;
  canvas.height = source.height;
  CanvasToy.setCanvas(canvas);
  var scene = new CanvasToy.Scene();
  var camera = new CanvasToy.PerspectiveCamera();
  camera.fovy = 45;
  var gl = CanvasToy.gl;
  sourceTexture = new CanvasToy.Texture2D(source);

  var randomVerticles = [];
  randomVerticles.push([ 0, 0 ]);
  randomVerticles.push([ 0, 1 ]);
  randomVerticles.push([ 1, 0 ]);
  randomVerticles.push([ 1, 1 ]);
  for (var i = 0; i < 5000; ++i) {
    randomVerticles.push([ Math.random(), Math.random() ]);
  }
  var triangles = Delaunay.triangulate(randomVerticles);

  var geometry = createFlatGeometry(randomVerticles, triangles);

  var triangleFaceMaterial = new CanvasToy.Material(
      {mainTexture : sourceTexture, color : vec3.fromValues(1, 1, 1)});

  triangleFaceMaterial.program.addPassing(function() {
    return {
      faces : geometry.faces,
      vertexShader : triangleVertShader,
      fragmentShader : triangleFragShader,
      attributes : {
        triangleUV1 : geometry.attributes.triangleUV1,
        triangleUV2 : geometry.attributes.triangleUV2
      }
    };
  });
  var rect = new CanvasToy.Mesh(geometry, [ triangleFaceMaterial ]);
  rect.translate(0, 0, -1.0);
  scene.addObject(rect);
  scene.addObject(camera);
  rect.registUpdate(() => { rect.translate(0, 0, 0); });
  CanvasToy.engine.render(scene, camera);
}

source.onload = () => {
  console.log('source reload');
  document.getElementById('container').innerHTML = '';
  CanvasToy.engine = null;
  canvas = document.createElement('canvas');
  document.getElementById('container').appendChild(canvas);
  loadResources();
};
