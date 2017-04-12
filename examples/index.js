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
    var camera = new CanvasToy.PerspectiveCamera();
    var mainTexture = new CanvasToy.Texture2D(renderer.gl, "resources/images/wood.jpg");
    var material = new CanvasToy.StandardMaterial(renderer.gl, { mainTexture: mainTexture });
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
    scene.addOnUpdateListener(function () {
        meshes[0].rotateY(-0.005);
        meshes[1].rotateY(0.01);
        meshes[2].rotateX(0.05);
    });
    scene.addObject(meshes[0], camera);
    camera.rotateX(-0.2);
    var light = new CanvasToy.DirectionalLight(renderer.gl).setDirection([-1, -1, -1]);
    scene.addLight(light);
    renderer.render(scene, camera);
    console.log(scene);
    return renderer;
});
examples.push(function (canvas) {
    var renderer = new CanvasToy.Renderer(canvas);
    var scene = new CanvasToy.Scene();
    var camera = new CanvasToy.PerspectiveCamera()
        .setPosition([0, 5, 5])
        .lookAt([0, 0, -10]);
    var checkerBoard = new CanvasToy.StandardMaterial(renderer.gl);
    checkerBoard.debug = true;
    var objectMaterial = new CanvasToy.StandardMaterial(renderer.gl, { mainTexture: new CanvasToy.Texture2D(renderer.gl, "resources/images/wood.jpg") });
    var ground = new CanvasToy.Mesh(new CanvasToy.TileGeometry(renderer.gl).build(), [objectMaterial])
        .setPosition([0, -1, -3]).rotateX(-Math.PI / 2).setScaling([10, 10, 10]);
    var back = new CanvasToy.Mesh(new CanvasToy.TileGeometry(renderer.gl).build(), [objectMaterial])
        .setPosition([0, 2, -10]).setScaling([5, 5, 5]);
    var box = new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl).build(), [objectMaterial])
        .setPosition([-2, -1, -5]).setScaling([0.5, 0.5, 0.5]);
    var sphere = new CanvasToy.Mesh(new CanvasToy.SphereGeometry(renderer.gl)
        .setWidthSegments(50)
        .setHeightSegments(50)
        .build(), [objectMaterial])
        .setPosition([2, 0, -5]).setScaling([0.5, 0.5, 0.5]);
    scene.addObject(ground, back, box, sphere, camera);
    var directLight = new CanvasToy.DirectionalLight(renderer.gl)
        .translate([10, 0, 0])
        .rotateX(-Math.PI / 2)
        .rotateY(0.6);
    var pointLight = new CanvasToy.PointLight(renderer.gl)
        .setPosition([0, 0, -3]).setIdensity(3).setRadius(8);
    var spotLight = new CanvasToy.SpotLight(renderer.gl)
        .setIdensity(600000)
        .rotateY(0.1)
        .setSpotDirection([10, 0, 0])
        .setConeAngle(Math.PI / 8);
    scene.addLight(directLight, spotLight);
    var time = 0;
    scene.addOnUpdateListener(function (delta) {
        time += delta;
        spotLight.rotateY(0.02 * Math.cos(time / 600));
        box.translate([0, 0.02 * Math.sin(time / 600), 0]);
        sphere.translate([0, -0.02 * Math.sin(time / 600), 0]);
    });
    scene.ambientLight = [0.2, 0.2, 0.2];
    renderer.render(scene, camera);
    return renderer;
});
examples.push(function (canvas) {
    var renderer = new CanvasToy.Renderer(canvas);
    var scene = new CanvasToy.Scene();
    var camera = new CanvasToy.PerspectiveCamera();
    var light = new CanvasToy.DirectionalLight(renderer.gl).setDirection([-1, -1, -1]).setIdensity(3);
    scene.addLight(light);
    var skyTexture = new CanvasToy.CubeTexture(renderer.gl, "resources/images/skybox/arid2_rt.jpg", "resources/images/skybox/arid2_lf.jpg", "resources/images/skybox/arid2_up.jpg", "resources/images/skybox/arid2_dn.jpg", "resources/images/skybox/arid2_bk.jpg", "resources/images/skybox/arid2_ft.jpg");
    createSkyBox(renderer, skyTexture).setParent(camera);
    scene.addObject(camera);
    var teapot = CanvasToy.OBJLoader.load(renderer.gl, "resources/models/teapot/teapot.obj");
    teapot.setAsyncFinished(teapot.asyncFinished().then(function () {
        var material = teapot.children[0].materials[0];
        material.reflectionMap = skyTexture;
        material.castShadow = false;
        return Promise.resolve(teapot);
    }));
    scene.addObject(teapot);
    teapot.translate([0, -2, -40]);
    var time = 0;
    scene.addOnUpdateListener(function () {
        time += 1 / 60;
        teapot.rotateX(0.01);
    });
    renderer.render(scene, camera);
    return renderer;
});
examples.push(function (canvas) {
    var renderer = new CanvasToy.Renderer(canvas);
    var scene = new CanvasToy.Scene();
    var camera = new CanvasToy.PerspectiveCamera().setPosition([0, 100, 100]).lookAt([0, 0, -40]);
    var tile = new CanvasToy.Mesh(new CanvasToy.RectGeometry(renderer.gl), [new CanvasToy.StandardMaterial(renderer.gl, {
            mainTexture: new CanvasToy.Texture2D(renderer.gl, "resources/images/wood.jpg"),
        })]).translate([0, -10, -40]).rotateX(-Math.PI / 2).setScaling([200, 200, 200]);
    scene.addObject(tile, camera);
    var teapotProto = CanvasToy.OBJLoader.load(renderer.gl, "resources/models/teapot/teapot.obj");
    teapotProto.setAsyncFinished(teapotProto.asyncFinished().then(function () {
        var material = teapotProto.children[0].materials[0];
        material.diffuse = [1, 0.8, 0.2];
        material.castShadow = false;
        var _loop_1 = function (i) {
            var teapot = new CanvasToy.Mesh(teapotProto.children[0].geometry, teapotProto.children[0].materials);
            scene.addObject(teapot);
            teapot.translate([(i % 10) * 40 - 200, 0, -40 - Math.floor(i / 10) * 40]);
            var time = 0;
            var spin = 0.03 * (Math.random() - 0.5);
            var light = new CanvasToy.PointLight(renderer.gl)
                .setPosition([Math.random() * 200.0 - 50, 4, Math.random() * 200.0 - 150])
                .setIdensity(0.5)
                .setRadius(50);
            scene.addLight(light);
            var vx = Math.random() * 3;
            var vy = Math.random() * 3;
            scene.addOnUpdateListener(function () {
                time += 1 / 60;
                teapot.rotateY(spin);
                light.translate([-Math.sin(time * vx), 0, -Math.cos(time * vy)]);
            });
        };
        for (var i = 0; i < 40; ++i) {
            _loop_1(i);
        }
        renderer.forceDeferred();
        renderer.render(scene, camera);
        return Promise.resolve(teapotProto);
    }));
    return renderer;
});
