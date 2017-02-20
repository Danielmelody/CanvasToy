var examples = [];
function onMouseOnStart(renderer) {
    renderer.canvas.onmouseover = function () {
        renderer.start();
    };
    renderer.canvas.onmouseleave = function () {
        renderer.stop();
    };
}
examples.push(function (canvas) {
    var renderer = new CanvasToy.Renderer(canvas);
    var scene = new CanvasToy.Scene();
    var camera = new CanvasToy.PerspectiveCamera();
    var cube = new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.StandardMaterial(renderer.gl, {
            specular: [0.1, 0.1, 0.1],
            mainTexture: new CanvasToy.Texture2D(renderer.gl, "basic/images/chrome.png"),
        })]);
    cube.translate([0, 0, -6]);
    scene.addObject(cube).addObject(camera);
    scene.ambientLight = [0.1, 0.1, 0.1];
    var light = new CanvasToy.PointLight().setPosition([100, 0, 100]);
    scene.addLight(light);
    cube.registUpdate(function () {
        cube.rotateY(0.01);
    });
    renderer.render(scene, camera);
    return renderer;
});
examples.push(function (canvas) {
    var renderer = new CanvasToy.Renderer(canvas);
    var scene = new CanvasToy.Scene();
    var camera = new CanvasToy.PerspectiveCamera();
    scene.ambientLight = [0.2, 0.1, 0.1];
    var light = new CanvasToy.PointLight();
    light.setPosition([100, 0, 100]).setColor([1, 1, 1]);
    scene.addLight(light);
    var test = new Promise(function (resolve, reject) {
        resolve(100);
    }).then(function (num) {
        console.log("promise resolve " + num);
    });
    CanvasToy.OBJLoader.load(renderer.gl, "basic/models/teapot/teapot.obj")
        .then(function (object) {
        scene.addObject(object);
        scene.addObject(camera);
        camera.translate([0, -8, 0]);
        object.translate([0, -10, -40]);
        var time = 0;
        object.rotateY(Math.PI / 2);
        object.registUpdate(function () {
            time += 1 / 60;
            light.translate([0, 10 * Math.cos(time * 4), 0]);
            object.rotateY(0.01);
        });
        renderer.render(scene, camera);
    });
    return renderer;
});
examples.push(function (canvas) {
    var renderer = new CanvasToy.Renderer(canvas);
    var scene = new CanvasToy.Scene();
    var camera = new CanvasToy.PerspectiveCamera();
    var node = new CanvasToy.Object3d();
    var mainTexture = new CanvasToy.Texture2D(renderer.gl, "basic/images/chrome.png");
    var material = new CanvasToy.StandardMaterial(renderer.gl, {
        mainTexture: mainTexture,
        specular: [1, 1, 1],
    });
    var mesh1 = new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl), [material]);
    var mesh2 = new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.StandardMaterial(renderer.gl, { mainTexture: mainTexture })]);
    mesh1.setParent(node);
    mesh2.setParent(node);
    scene.addObject(node);
    scene.addObject(camera);
    var light = new CanvasToy.PointLight().setPosition([100, 0, 100]);
    scene.addLight(light);
    mesh1.translate([2, 0, 0]);
    mesh2.translate([-2, 0, 0]);
    node.translate([0, 0, -10.0]);
    mesh1.registUpdate(function (deltaTime) {
        node.rotateY(0.01);
    });
    renderer.render(scene, camera);
    return renderer;
});
examples.push(function (canvas) {
    var renderer = new CanvasToy.Renderer(canvas);
    var scenes = Array(2, 0).map(function () { return new CanvasToy.Scene(); });
    var cameras = Array(2, 0).map(function () { return new CanvasToy.PerspectiveCamera(); });
    var light = new CanvasToy.PointLight();
    var cubes = [
        new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.StandardMaterial(renderer.gl)]),
    ];
    cubes[0].materials[0].mainTexture = new CanvasToy.Texture2D(renderer.gl, "basic/images/chrome.png")
        .setFormat(renderer.gl.RGBA);
    cameras[0].setPosition([0, 0, 5]);
    scenes[0].ambientLight = vec3.fromValues(0.1, 0.1, 0.1);
    scenes[1].ambientLight = vec3.fromValues(0.1, 0.1, 0.1);
    light.setPosition([100, 0, 100]);
    scenes[0].addLight(light).addObject(cameras[0]).addObject(cubes[0]);
    var fbo = renderer.createFrameBuffer();
    var rttTexture = fbo.attachments.color.targetTexture;
    cubes.push(new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.StandardMaterial(renderer.gl, { mainTexture: rttTexture })]));
    cubes[0].registUpdate(function () {
        cubes.forEach(function (cube) {
            cube.rotateY(0.01);
        });
    });
    cameras[1].setPosition([0, 0, 5]);
    scenes[1].addLight(light).addObject(cameras[1]).addObject(cubes[1]);
    scenes[0].addLight(light);
    renderer.renderFBO(scenes[0], cameras[0]);
    renderer.render(scenes[1], cameras[1]);
    return renderer;
});
examples.push(function (canvas) {
    var renderer = new CanvasToy.Renderer(canvas);
    return renderer;
});
