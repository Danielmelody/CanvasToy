/// <reference path="../../../build/debug/canvas-toy.d.ts"/>
/// <reference path="../../../typings/index.d.ts"/>
/// <reference path="../../index.ts"/>

examples.push((canvas: HTMLCanvasElement) => {
    const renderer = new CanvasToy.Renderer(canvas);
    const scene = new CanvasToy.Scene();
    const camera = new CanvasToy.PerspectiveCamera();
    scene.ambientLight = [0.4, 0.4, 0.4];
    const light = new CanvasToy.PointLight(renderer.gl);
    light.setPosition([30, 0, 200]).setColor([1, 1, 1]).setIdensity(2);
    scene.addLight(light);

    const skyTexture = new CanvasToy.CubeTexture(
        renderer.gl,
        "resources/images/skybox/arid2_rt.jpg",
        "resources/images/skybox/arid2_lf.jpg",
        "resources/images/skybox/arid2_up.jpg",
        "resources/images/skybox/arid2_dn.jpg",
        "resources/images/skybox/arid2_bk.jpg",
        "resources/images/skybox/arid2_ft.jpg",
    );
    createSkyBox(renderer, skyTexture).setParent(camera);

    scene.addObject(camera);

    const test = new Promise((resolve, reject) => {
        resolve(100);
    }).then((num) => {
        console.log(`promise resolve ${num}`);
    });
    const teapot = CanvasToy.OBJLoader.load(renderer.gl, "resources/models/teapot/teapot.obj");
    teapot.setAsyncFinished(teapot.asyncFinished().then(() => {
        const material = (teapot.children[0] as CanvasToy.Mesh).materials[0] as CanvasToy.StandardMaterial;
        material.reflectionMap = skyTexture;
        return Promise.resolve(teapot);
    }));
    scene.addObject(teapot);
    camera.translate([0, -8, 0]);
    teapot.translate([0, -10, -40]);
    let time = 0;
    teapot.registUpdate(() => {
        time += 1 / 60;
        light.translate([0, 10 * Math.cos(time * 4), 0]);
        teapot.rotateX(0.01);
    });
    renderer.render(scene, camera);
    return renderer;
});
