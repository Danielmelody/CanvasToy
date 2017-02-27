/// <reference path="../../build/debug/canvas-toy.d.ts"/>
/// <reference path="../../typings/index.d.ts"/>
/// <reference path="../index.ts"/>

examples.push((canvas: HTMLCanvasElement) => {
    const renderer = new CanvasToy.Renderer(canvas);
    const scene = new CanvasToy.Scene();
    const camera = new CanvasToy.PerspectiveCamera().setFar(50);
    const light = new CanvasToy.PointLight(renderer.gl);
    light.setPosition([100, 300, 100]).setIdensity(2);
    scene.addLight(light);
    scene.addObject(camera);

    const test = new Promise((resolve, reject) => {
        resolve(100);
    }).then((num) => {
        console.log(`promise resolve ${num}`);
    });
    const teapot = CanvasToy.OBJLoader.load(renderer.gl, "resources/models/teapot/teapot.obj");
    scene.addObject(teapot);
    teapot.translate([0, -2, -40]);
    let time = 0;
    teapot.registUpdate(() => {
        time += 1 / 60;
        teapot.rotateX(0.01);
    });
    renderer.forceDeferred();
    renderer.render(scene, camera);
    return renderer;
});
