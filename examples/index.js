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
    var image = new Image();
    image.src = "basic/images/chrome.png";
    var cube = new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.StandardMaterial(renderer.gl, {
            specular: [0.1, 0.1, 0.1],
            mainTexture: new CanvasToy.Texture2D(renderer.gl, image),
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
    var camera2 = new CanvasToy.PerspectiveCamera();
    scene.ambientLight = [0.2, 0.1, 0.1];
    var light = new CanvasToy.PointLight();
    light.setPosition([100, 0, 100]).setColor([1, 1, 1]);
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
    return renderer;
});
examples.push(function (canvas) {
    var renderer = new CanvasToy.Renderer(canvas);
    var scene = new CanvasToy.Scene();
    var camera = new CanvasToy.PerspectiveCamera();
    var node = new CanvasToy.Object3d();
    var image = new Image();
    image.src = "basic/images/chrome.png";
    var mainTexture = new CanvasToy.Texture2D(renderer.gl, image);
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
    var image = new Image();
    image.src = "basic/images/chrome.png";
    cubes[0].materials[0].mainTexture = new CanvasToy.Texture2D(renderer.gl, image)
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
    renderer.gl.enable(renderer.gl.CULL_FACE);
    var scenes = Array(2, 0).map(function () { return new CanvasToy.Scene(); });
    var cameras = Array(2, 0).map(function () { return new CanvasToy.PerspectiveCamera(); });
    var light = new CanvasToy.PointLight();
    var cube = new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.StandardMaterial(renderer.gl)]).rotateY(2).translate([0, 0, -3]);
    var image = new Image();
    image.src = "basic/images/chrome.png";
    cube.materials[0].mainTexture = new CanvasToy.Texture2D(renderer.gl, image)
        .setFormat(renderer.gl.RGBA);
    scenes[0].ambientLight = vec3.fromValues(0.1, 0.1, 0.1);
    scenes[1].ambientLight = vec3.fromValues(0.1, 0.1, 0.1);
    light.setPosition([100, 0, 100]);
    scenes[0].addLight(light).addObject(cameras[0]).addObject(cube);
    var fbo = renderer.createFrameBuffer();
    fbo.attachments.depth
        .setType(renderer.gl, CanvasToy.AttachmentType.Texture)
        .targetTexture
        .setType(renderer.gl.UNSIGNED_SHORT)
        .setFormat(renderer.gl.DEPTH_COMPONENT);
    var rttTexture = fbo.attachments.depth.targetTexture;
    var depthMaterial = new CanvasToy.StandardMaterial(renderer.gl, { mainTexture: rttTexture });
    depthMaterial.program = new CanvasToy.StandardShaderBuilder()
        .setInterplotationMethod(CanvasToy.InterplotationMethod.DepthPhong)
        .build(renderer.gl);
    var rect = new CanvasToy.Mesh(new CanvasToy.RectGeometry(renderer.gl), [depthMaterial]).setScaling([canvas.width / canvas.height, 1, 1]);
    cube.registUpdate(function () {
        cube.rotateY(0.02);
    });
    cameras[0].setFar(4).setNear(1);
    cameras[1].setPosition([0, 0, 2]);
    scenes[1].addLight(light).addObject(cameras[1]).addObject(rect);
    scenes[0].addLight(light);
    renderer.renderFBO(scenes[0], cameras[0]);
    renderer.render(scenes[1], cameras[1]);
    depthMaterial.program.addUniform("cameraNear", {
        type: CanvasToy.DataType.float,
        updator: function (obj, camera) { return camera.near; },
    });
    depthMaterial.program.addUniform("cameraFar", {
        type: CanvasToy.DataType.float,
        updator: function (obj, camera) { return camera.far; },
    });
    return renderer;
});
