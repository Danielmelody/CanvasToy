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
    meshes[0].registUpdate(function () {
        meshes[0].rotateY(-0.005);
        meshes[1].rotateY(0.01);
        meshes[2].rotateX(0.05);
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
    var material = new CanvasToy.StandardMaterial(renderer.gl, {
        mainTexture: new CanvasToy.Texture2D(renderer.gl, "resources/images/wood.jpg"),
    });
    var tile = new CanvasToy.Mesh(new CanvasToy.TileGeometry(renderer.gl).build(), [material])
        .setPosition([0, 0, -3]);
    scene.addObject(tile).addObject(camera);
    scene.addLight(new CanvasToy.PointLight(renderer.gl).setPosition([100, 0, 100]));
    scene.ambientLight = [0.2, 0.2, 0.2];
    renderer.render(scene, camera);
    return renderer;
});
examples.push(function (canvas) {
    var renderer = new CanvasToy.Renderer(canvas);
    var scene = new CanvasToy.Scene();
    var camera = new CanvasToy.PerspectiveCamera();
    var light = new CanvasToy.PointLight(renderer.gl);
    light.setPosition([100, 300, 100]).setColor([1, 1, 1]).setIdensity(3);
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
    teapot.translate([0, -2, -40]);
    var time = 0;
    teapot.registUpdate(function () {
        time += 1 / 60;
        teapot.rotateX(0.01);
    });
    renderer.render(scene, camera);
    return renderer;
});
examples.push(function (canvas) {
    var renderer = new CanvasToy.Renderer(canvas);
    var scene = new CanvasToy.Scene();
    var light = new CanvasToy.PointLight(renderer.gl).setPosition([0, 5, -40]).setIdensity(2).setRadius(1000);
    var up = vec3.cross(vec3.create(), [1, 0, 0], [0, 0, -40]);
    var camera = new CanvasToy.PerspectiveCamera().setPosition([0, 100, 100]).lookAt([0, 0, -40], up);
    scene.addLight(light);
    scene.addObject(camera);
    var tile = new CanvasToy.Mesh(new CanvasToy.RectGeometry(renderer.gl), [new CanvasToy.StandardMaterial(renderer.gl, {
            mainTexture: new CanvasToy.Texture2D(renderer.gl, "resources/images/wood.jpg"),
        })]).translate([0, -10, -40]).rotateX(-Math.PI / 2).setScaling([200, 200, 200]);
    scene.addObject(tile);
    tile.registUpdate(function () {
    });
    var teapotProto = CanvasToy.OBJLoader.load(renderer.gl, "resources/models/teapot/teapot.obj");
    teapotProto.setAsyncFinished(teapotProto.asyncFinished().then(function () {
        var _loop_1 = function (i) {
            var teapot = new CanvasToy.Mesh(teapotProto.children[0].geometry, teapotProto.children[0].materials);
            scene.addObject(teapot);
            teapot.translate([(i % 10) * 40 - 200, 0, -40 - Math.floor(i / 10) * 40]);
            var time = 0;
            var spin = 0.03 * (Math.random() - 0.5);
            teapot.registUpdate(function () {
                time += 1 / 60;
                teapot.rotateY(spin);
            });
            var material = teapot.materials[0];
        };
        for (var i = 0; i < 100; ++i) {
            _loop_1(i);
        }
        renderer.forceDeferred();
        renderer.render(scene, camera);
        return Promise.resolve(teapotProto);
    }));
    return renderer;
});
