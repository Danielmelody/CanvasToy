var examples = [];
examples.push(function (canvas) {
    CanvasToy.setCanvas(canvas);
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
    var red = new CanvasToy.Material({
        color: vec3.fromValues(1, 0, 0),
        mainTexture: new CanvasToy.Texture2D(image, CanvasToy.gl.RGB),
    });
    var green = new CanvasToy.Material({ color: [0, 1, 0] });
    CanvasToy.OBJLoader.load("basic/models/teapot.obj", function (object) {
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
        CanvasToy.engine.render(scene, camera2);
        CanvasToy.engine.render(scene, camera);
    });
});
