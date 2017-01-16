var examples = [];
examples.push(function (canvas) {
    var renderer = new CanvasToy.Renderer(canvas);
    var scene = new CanvasToy.Scene();
    var camera = new CanvasToy.PerspectiveCamera();
    var camera2 = new CanvasToy.PerspectiveCamera();
    scene.ambientLight = [0.2, 0.1, 0.1];
    var light = new CanvasToy.PointLight();
    light.position = [100, 0, 100];
    light.diffuse = [1, 1, 1];
    light.specular = [0.3, 0.3, 0.3];
    var light2 = new CanvasToy.PointLight();
    light2.position = [100, 0, 100];
    light2.diffuse = [1, 0.5, 0.5];
    light2.specular = [1, 1, 1];
    scene.addLight(light);
    var image = new Image();
    image.src = "basic/images/sea.jpg";
    var red = new CanvasToy.Material(renderer.gl, {
        color: vec3.fromValues(1, 0, 0),
        mainTexture: new CanvasToy.Texture2D(renderer.gl, image),
    });
    red.mainTexture.type = renderer.gl.RGB;
    var green = new CanvasToy.Material(renderer.gl, { color: [0, 1, 0] });
    CanvasToy.OBJLoader.load(renderer.gl, "basic/models/teapot.obj", function (object) {
        scene.addObject(object);
        scene.addObject(camera);
        scene.addObject(camera2);
        camera.translate([0, -8, 0]);
        camera2.translate([0, -8, 0]);
        camera2.rotateZ(Math.PI);
        for (var _i = 0, _a = object.children; _i < _a.length; _i++) {
            var childObj = _a[_i];
            var child = childObj;
            child.materials = [red, green];
        }
        object.translate([0, 0, -50]);
        var time = 0;
        object.rotateY(Math.PI / 2);
        object.registUpdate(function () {
            time += 1 / 60;
            object.rotateY(0.01);
        });
        renderer.render(scene, camera2);
        renderer.render(scene, camera);
    });
});
examples.push(function (canvas) {
    var renderer = new CanvasToy.Renderer(canvas);
    var scenes = Array(2, 0).map(function () { return new CanvasToy.Scene(); });
    var cameras = Array(2, 0).map(function () { return new CanvasToy.PerspectiveCamera(); });
    var light = new CanvasToy.PointLight();
    var cubes = [new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.Material(renderer.gl)])];
    cameras[0].position = [0, 0, 5];
    scenes[0].ambientLight = vec3.fromValues(0.2, 0.1, 0.1);
    light.idensity = 1;
    light.position = [100, 0, 100];
    light.diffuse = [1, 1, 1];
    light.specular = [1, 1, 0.3];
    scenes[0].addLight(light);
    scenes[0].addObject(cameras[0]);
    scenes[0].addObject(cubes[0]);
    var fbo = renderer.createFrameBuffer();
    fbo.enableRenderBuffer(renderer.gl, CanvasToy.BufferUsage.Color);
    var rttTexture = fbo.getRenderBuffer(CanvasToy.BufferUsage.Color).toTexture(renderer.gl);
    cubes.push(new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.Material(renderer.gl, {
            mainTexture: rttTexture,
        })]));
    cubes[0].registUpdate(function () {
        cubes.forEach(function (cube) {
            cube.rotateY(0.01);
        });
    });
    cameras[1].position = [0, 0, 5];
    scenes[1].addLight(light);
    scenes[0].addLight(light);
    scenes[1].addObject(cameras[1]);
    scenes[1].addObject(cubes[1]);
    renderer.renderFBO(scenes[0], cameras[0]);
    renderer.render(scenes[1], cameras[1]);
});
