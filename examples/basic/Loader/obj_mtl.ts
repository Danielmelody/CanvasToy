/// <reference path="../../../build/debug/canvas-toy.d.ts"/>
/// <reference path="../../../typings/index.d.ts"/>
/// <reference path="../../index.ts"/>

examples.push((canvas: HTMLCanvasElement) => {
    const renderer = new CanvasToy.Renderer(canvas);
    const scene = new CanvasToy.Scene();
    const camera = new CanvasToy.PerspectiveCamera();
    scene.ambientLight = [0.2, 0.1, 0.1];
    const light = new CanvasToy.PointLight();
    light.setPosition([100, 0, 100]).setColor([1, 1, 1]);
    scene.addLight(light);

    const test = new Promise((resolve, reject) => {
        resolve(100);
    }).then((num) => {
        console.log(`promise resolve ${num}`);
    });
    CanvasToy.OBJLoader.load(renderer.gl, "basic/models/teapot/teapot.obj")
        .then((object) => {
            scene.addObject(object);
            scene.addObject(camera);
            camera.translate([0, -8, 0]);
            object.translate([0, -10, -40]);
            let time = 0;
            object.rotateY(Math.PI / 2);
            object.registUpdate(() => {
                time += 1 / 60;
                light.translate([0, 10 * Math.cos(time * 4), 0]);
                object.rotateY(0.01);
            });
            // renderer.render(scene, camera2);
            renderer.render(scene, camera);
        });
    return renderer;
});
