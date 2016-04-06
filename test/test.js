function start(){
    var canvas = document.getElementById('canvas');
    CanvasToy.setCanvas(canvas);


    var scene = new CanvasToy.Scene();
    var camera = new CanvasToy.PerspectiveCamera();

    var cube = new CanvasToy.CubeGeometry();
    console.dir(cube);
    var material = new CanvasToy.Material();

    var mesh = new CanvasToy.Mesh(cube, material);

    scene.addObject(mesh);
    CanvasToy.engine.startRender(scene, camera, 1000/60);
}
