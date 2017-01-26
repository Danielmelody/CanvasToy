var examples = [];
examples.push(function (canvas) {
    var renderer = new CanvasToy.Renderer(canvas);
    var scene = new CanvasToy.Scene();
    var camera = new CanvasToy.PerspectiveCamera();
    var image = new Image();
    image.src = "basic/images/chrome.png";
    var cube = new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.StandardMaterial(renderer.gl, {
            color: vec3.fromValues(1, 1, 1),
            mainTexture: new CanvasToy.Texture2D(renderer.gl, image),
        })]);
    cube.translate([0, 0, -6]);
    scene.addObject(cube);
    scene.addObject(camera);
    scene.ambientLight = [0.1, 0.1, 0.1];
    var light = new CanvasToy.PointLight();
    light.position[2] = 10;
    scene.addLight(light);
    cube.registUpdate(function () {
        cube.rotateY(0.01);
    });
    renderer.render(scene, camera);
});
examples.push(function (canvas) {
    var renderer = new CanvasToy.Renderer(canvas);
    var scene = new CanvasToy.Scene();
    var camera = new CanvasToy.PerspectiveCamera();
    var camera2 = new CanvasToy.PerspectiveCamera();
    scene.ambientLight = [0.2, 0.1, 0.1];
    var light = new CanvasToy.PointLight();
    light.position = [100, 0, 100];
    light.setColor([1, 1, 1]);
    scene.addLight(light);
    var woodImage = new Image();
    woodImage.src = "basic/images/wood.jpg";
    var wood = new CanvasToy.StandardMaterial(renderer.gl, {
        mainTexture: new CanvasToy.Texture2D(renderer.gl, woodImage)
            .setFormat(renderer.gl.RGB)
            .setWrapS(renderer.gl.REPEAT)
            .setWrapT(renderer.gl.REPEAT),
        specular: [0.1, 0.1, 0.1],
    });
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
            child.materials = [wood];
        }
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
});
examples.push(function (canvas) {
    var renderer = new CanvasToy.Renderer(canvas);
    var scenes = Array(2, 0).map(function () { return new CanvasToy.Scene(); });
    var cameras = Array(2, 0).map(function () { return new CanvasToy.PerspectiveCamera(); });
    var light = new CanvasToy.PointLight();
    var cubes = [
        new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.StandardMaterial(renderer.gl)]),
    ];
    var image = new Image();
    image.src = "basic/images/chrome.png";
    cubes[0].materials[0].mainTexture = new CanvasToy.Texture2D(renderer.gl, image)
        .setFormat(renderer.gl.RGBA);
    cameras[0].position = [0, 0, 5];
    scenes[0].ambientLight = vec3.fromValues(0.1, 0.1, 0.1);
    scenes[1].ambientLight = vec3.fromValues(0.1, 0.1, 0.1);
    light.position = [100, 0, 100];
    scenes[0].addLight(light);
    scenes[0].addObject(cameras[0]);
    scenes[0].addObject(cubes[0]);
    var fbo = renderer.createFrameBuffer();
    var rttTexture = fbo.attachments.color.targetTexture;
    cubes.push(new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.StandardMaterial(renderer.gl, { mainTexture: rttTexture })]));
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
examples.push(function (canvas) {
    var renderer = new CanvasToy.Renderer(canvas);
    var scenes = Array(2, 0).map(function () { return new CanvasToy.Scene(); });
    var cameras = Array(2, 0).map(function () { return new CanvasToy.PerspectiveCamera(); });
    var light = new CanvasToy.PointLight();
    var cubes = [
        new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.StandardMaterial(renderer.gl)]),
    ];
    var image = new Image();
    image.src = "basic/images/chrome.png";
    cubes[0].materials[0].mainTexture = new CanvasToy.Texture2D(renderer.gl, image)
        .setFormat(renderer.gl.RGBA);
    cameras[0].position = [0, 0, 5];
    scenes[0].ambientLight = vec3.fromValues(0.1, 0.1, 0.1);
    scenes[1].ambientLight = vec3.fromValues(0.1, 0.1, 0.1);
    light.position = [100, 0, 100];
    scenes[0].addLight(light);
    scenes[0].addObject(cameras[0]);
    scenes[0].addObject(cubes[0]);
    var fbo = renderer.createFrameBuffer();
    fbo.attachments.depth
        .setType(renderer.gl, CanvasToy.AttachmentType.Texture)
        .targetTexture.setType(renderer.gl.UNSIGNED_SHORT);
    var rttTexture = fbo.attachments.depth.targetTexture;
    cubes.push(new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.StandardMaterial(renderer.gl, { mainTexture: rttTexture })]));
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
