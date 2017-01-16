/// <reference path="../../../build/debug/canvas-toy.d.ts"/>
/// <reference path="../../../typings/index.d.ts"/>
/// <reference path="../../index.ts"/>

examples.push((canvas: HTMLCanvasElement) => {
    const renderer = new CanvasToy.Renderer(canvas);
    const scene = new CanvasToy.Scene();
    const camera = new CanvasToy.PerspectiveCamera();
    const camera2 = new CanvasToy.PerspectiveCamera();
    scene.ambientLight = [0.2, 0.1, 0.1];
    const light = new CanvasToy.PointLight();
    light.position = [100, 0, 100];
    light.diffuse = [1, 1, 1];
    light.specular = [0.3, 0.3, 0.3];

    const light2 = new CanvasToy.PointLight();
    light2.position = [100, 0, 100];
    light2.diffuse = [1, 0.5, 0.5];
    light2.specular = [1, 1, 1];

    scene.addLight(light);
    const image = new Image();
    image.src = "basic/images/sea.jpg";
    const red = new CanvasToy.Material(renderer.gl, {
        color: vec3.fromValues(1, 0, 0),
        mainTexture: new CanvasToy.Texture2D(renderer.gl, image),
    });
    red.mainTexture.type = renderer.gl.RGB;
    const green =
        new CanvasToy.Material(renderer.gl, { color: [0, 1, 0] });
    CanvasToy.OBJLoader.load(renderer.gl, "basic/models/teapot.obj", (object) => {
        scene.addObject(object);
        scene.addObject(camera);
        scene.addObject(camera2);
        camera.translate([0, -8, 0]);
        camera2.translate([0, -8, 0]);
        camera2.rotateZ(Math.PI);
        for (const childObj of object.children) {
            const child = childObj as CanvasToy.Mesh;
            child.materials = [red, green];
        }
        object.translate([0, 0, -50]);
        let time = 0;
        object.rotateY(Math.PI / 2);
        object.registUpdate(() => {
            time += 1 / 60;
            object.rotateY(0.01);
        });
        renderer.render(scene, camera2);
        renderer.render(scene, camera);
    });
});
