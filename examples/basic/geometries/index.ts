/// <reference path="../../../build/debug/canvas-toy.d.ts"/>
/// <reference path="../../../typings/index.d.ts"/>
/// <reference path="../../index.ts"/>

examples.push((canvas: HTMLCanvasElement) => {
    const renderer = new CanvasToy.Renderer(canvas);

    const scene = new CanvasToy.Scene();
    const camera = new CanvasToy.PerspectiveCamera();
    const material = new CanvasToy.StandardMaterial(renderer.gl, {
        mainTexture: new CanvasToy.Texture2D(renderer.gl, "resources/images/wood.jpg"),
    });
    const tile = new CanvasToy.Mesh(new CanvasToy.TileGeometry(renderer.gl).build(), [material])
        .setPosition([0, 0, -3]);
    scene.addObject(tile).addObject(camera);
    scene.addLight(new CanvasToy.PointLight(renderer.gl).setPosition([100, 0, 100]));
    scene.ambientLight = [0.2, 0.2, 0.2];
    renderer.render(scene, camera);
    return renderer;
});
