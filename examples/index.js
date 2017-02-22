var examples = [];
function onMouseOnStart(renderer) {
    renderer.canvas.onmouseover = function () {
        renderer.start();
    };
    renderer.canvas.onmouseleave = function () {
        renderer.stop();
    };
}
function createSkyBox(renderer, cubeTexture) {
    return new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.SkyMaterial(renderer.gl, cubeTexture)]);
}
examples.push(function (canvas) {
    var renderer = new CanvasToy.Renderer(canvas);
    var scene = new CanvasToy.Scene();
    scene.ambientLight = [0.1, 0.1, 0.1];
    var camera = new CanvasToy.PerspectiveCamera();
    var mainTexture = new CanvasToy.Texture2D(renderer.gl, "resources/images/wood.jpg");
    var material = new CanvasToy.StandardMaterial(renderer.gl, {
        mainTexture: mainTexture,
        specular: [1, 1, 1],
    });
    var meshes = [];
    for (var i = 0; i < 4; ++i) {
        var mesh = new CanvasToy.Mesh(new CanvasToy.SphereGeometry(renderer.gl).setWidthSegments(20).setHeightSegments(20).build(), [material]);
        if (i > 0) {
            mesh.setParent(meshes[i - 1]);
            if (i === 3) {
                mesh.setLocalPosition([0, 2.5 - i / 4.0, 0]);
            }
            else {
                mesh.setLocalPosition([2.5 - i / 4.0, 0, 0]);
            }
        }
        var scaleFactor = Math.pow(2, (1 - i));
        mesh.setScaling([scaleFactor, scaleFactor, scaleFactor]);
        meshes.push(mesh);
    }
    meshes[0].translate([0, -2, -10]);
    meshes[0].registUpdate(function () {
        meshes[0].rotateY(-0.01);
        meshes[1].rotateY(0.03);
        meshes[2].rotateX(0.03);
    });
    scene.addObject(meshes[0]);
    scene.addObject(camera);
    camera.rotateX(-0.2);
    var light = new CanvasToy.PointLight(renderer.gl).setPosition([100, 0, 100]);
    scene.addLight(light);
    renderer.render(scene, camera);
    console.log(scene);
    return renderer;
});
examples.push(function (canvas) {
    var renderer = new CanvasToy.Renderer(canvas);
    var scene = new CanvasToy.Scene();
    var camera = new CanvasToy.PerspectiveCamera();
    var cube = new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.StandardMaterial(renderer.gl, {
            specular: [0.1, 0.1, 0.1],
            mainTexture: new CanvasToy.Texture2D(renderer.gl, "resources/images/chrome.png"),
        })]);
    cube.translate([-2, 0, -6]);
    var sphere = new CanvasToy.Mesh(new CanvasToy.SphereGeometry(renderer.gl)
        .setRadius(1.5)
        .setWidthSegments(100)
        .setHeightSegments(100)
        .build(), [new CanvasToy.StandardMaterial(renderer.gl, {
            specular: [0.1, 0.1, 0.1],
            mainTexture: new CanvasToy.Texture2D(renderer.gl, "resources/images/wood.jpg"),
        })]);
    sphere.translate([2, 0, -6]);
    scene.addObject(cube).addObject(sphere).addObject(camera);
    scene.ambientLight = [0.1, 0.1, 0.1];
    var light = new CanvasToy.PointLight(renderer.gl);
    scene.addLight(light);
    var time = 0;
    cube.registUpdate(function (delta) {
        time += delta;
        cube.rotateY(0.01);
        sphere.rotateX(0.01);
        light.setPosition([-10, 30 * Math.sin(time / 200), 100]);
    });
    renderer.render(scene, camera);
    return renderer;
});
examples.push(function (canvas) {
    var renderer = new CanvasToy.Renderer(canvas);
    var scene = new CanvasToy.Scene();
    var camera = new CanvasToy.PerspectiveCamera();
    scene.ambientLight = [0.4, 0.4, 0.4];
    var light = new CanvasToy.PointLight(renderer.gl);
    light.setPosition([30, 0, 200]).setColor([1, 1, 1]).setIdensity(2);
    scene.addLight(light);
    var skyTexture = new CanvasToy.CubeTexture(renderer.gl, "resources/images/skybox/arid2_rt.jpg", "resources/images/skybox/arid2_lf.jpg", "resources/images/skybox/arid2_up.jpg", "resources/images/skybox/arid2_dn.jpg", "resources/images/skybox/arid2_bk.jpg", "resources/images/skybox/arid2_ft.jpg");
    createSkyBox(renderer, skyTexture).setParent(camera);
    scene.addObject(camera);
    var test = new Promise(function (resolve, reject) {
        resolve(100);
    }).then(function (num) {
        console.log("promise resolve " + num);
    });
    var teapot = CanvasToy.OBJLoader.load(renderer.gl, "resources/models/teapot/teapot.obj");
    teapot.setAsyncFinished(teapot.asyncFinished().then(function () {
        var material = teapot.children[0].materials[0];
        material.reflectionMap = skyTexture;
        return Promise.resolve(teapot);
    }));
    scene.addObject(teapot);
    camera.translate([0, -8, 0]);
    teapot.translate([0, -10, -40]);
    var time = 0;
    teapot.registUpdate(function () {
        time += 1 / 60;
        light.translate([0, 10 * Math.cos(time * 4), 0]);
        teapot.rotateX(0.01);
    });
    renderer.render(scene, camera);
    return renderer;
});
examples.push(function (canvas) {
    var renderer = new CanvasToy.Renderer(canvas);
    var scenes = Array(2, 0).map(function () { return new CanvasToy.Scene(); });
    var cameras = Array(2, 0).map(function () { return new CanvasToy.PerspectiveCamera(); });
    var light = new CanvasToy.PointLight(renderer.gl);
    var cubes = [
        new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.StandardMaterial(renderer.gl)]),
    ];
    cubes[0].materials[0]
        .mainTexture = new CanvasToy.Texture2D(renderer.gl, "resources/images/chrome.png")
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
