function start(){
    var canvas = document.getElementById('canvas');
    CanvasToy.setCanvas(canvas);


    var scene = new CanvasToy.Scene();
    var camera = new CanvasToy.OrthoCamera();

    var cube = new CanvasToy.CubeGeometry();
    var material = new CanvasToy.Material();

    var mesh = new CanvasToy.Mesh(cube, material);

    var angle = 0.01;

    mesh.translate(0, 0, -10.0);
    mesh.rotateY(20);

    mesh.registerUpdate(()=>{
       //mesh.translate(0, 0, 0);
        mesh.rotateX(angle);
        mesh.rotateY(angle);
        //console.log(mesh.modelViewMatrix);
    });

    //mesh.translate(100, 0, 0);

    //mesh.translate(100, 0, 0);

    scene.addObject(mesh);

    CanvasToy.engine.startRender(scene, camera, 1000/60);
}
