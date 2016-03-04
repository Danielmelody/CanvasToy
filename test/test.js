function start(){
    var canvas = document.getElementById('canvas');
    var renderer = new CanvasToy.Renderer(canvas);
    var scene = new CanvasToy.Scene();
    var camera = new CanvasToy.Camera();

    var cube = new CanvasToy.CubeGeometry();
    var material = new CanvasToy.Material();

    var Mesh = new CanvasToy.Mesh(cube, material);

    renderer.startRender(scene, camera, 1000 / 60);
}
