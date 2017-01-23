/// <reference path="../../../build/debug/canvas-toy.d.ts"/>
/// <reference path="../../../typings/index.d.ts"/>
/// <reference path="../../index.ts"/>
///
examples.push((canvas: HTMLCanvasElement) => {
    const renderer = new CanvasToy.Renderer(canvas);

    const scene = new CanvasToy.Scene();
    const camera = new CanvasToy.PerspectiveCamera();

    const image = new Image();
    image.src = "basic/images/chrome.png";

    const cube = new CanvasToy.Mesh(
        new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.StandardMaterial(renderer.gl, {
            color: vec3.fromValues(1, 1, 1),
            mainTexture: new CanvasToy.Texture2D(renderer.gl, image),
        })]);
    cube.translate([0, 0, -6]);
    scene.addObject(cube);
    scene.addObject(camera);

    scene.ambientLight = [0.1, 0.1, 0.1];
    const light = new CanvasToy.PointLight();
    light.position[2] = 10;
    scene.addLight(light);

    cube.registUpdate(() => {
        cube.rotateY(0.01);
    });
    renderer.render(scene, camera);
});
