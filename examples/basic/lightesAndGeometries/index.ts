/// <reference path="../../../build/debug/canvas-toy.d.ts"/>
/// <reference path="../../../typings/index.d.ts"/>
/// <reference path="../../index.ts"/>

examples.push((canvas: HTMLCanvasElement) => {
    const renderer = new CanvasToy.Renderer(canvas);

    const scene = new CanvasToy.Scene();
    const camera = new CanvasToy.PerspectiveCamera()
        .setPosition([0, 5, 5])
        .lookAt([0, 0, -10]);
    const checkerBoard = new CanvasToy.StandardMaterial(renderer.gl);
    checkerBoard.debug = true;
    const objectMaterial = new CanvasToy.StandardMaterial(renderer.gl,
        { mainTexture: new CanvasToy.Texture2D(renderer.gl, "resources/images/wood.jpg") });
    // objectMaterial.castShadow = false;
    const ground = new CanvasToy.Mesh(new CanvasToy.TileGeometry(renderer.gl).build(), [objectMaterial])
        .setPosition([0, -1, -3]).rotateX(-Math.PI / 2).setScaling([10, 10, 10]);
    const back = new CanvasToy.Mesh(new CanvasToy.TileGeometry(renderer.gl).build(), [objectMaterial])
        .setPosition([0, 2, -10]).setScaling([5, 5, 5]);
    const box = new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl).build(), [objectMaterial])
        .setPosition([-2, -1, -5]).setScaling([0.5, 0.5, 0.5]);
    const sphere = new CanvasToy.Mesh(
        new CanvasToy.SphereGeometry(renderer.gl)
            .setWidthSegments(50)
            .setHeightSegments(50)
            .build(),
        [objectMaterial])
        .setPosition([2, 0, -5]).setScaling([0.5, 0.5, 0.5]);
    scene.addObject(ground, back, box, sphere, camera);
    const directLight = new CanvasToy.DirectionalLight(renderer.gl).setDirection([-1, -1, 0]);
    const pointLight = new CanvasToy.PointLight(renderer.gl)
        .setPosition([0, 0, -3]).setIdensity(3).setRadius(8);
    const spotLight = new CanvasToy.SpotLight(renderer.gl)
        .setIdensity(600000)
        .setSpotDirection([10, 0, 0])
        .setConeAngle(Math.PI / 4);
    scene.addLight(spotLight);
    let time = 0;
    scene.addOnUpdateListener((delta) => {
        time += delta;
        spotLight.rotateY(0.02 * Math.cos(time / 600));
        box.translate([0, 0.02 * Math.sin(time / 600), 0]);
        sphere.translate([0, -0.02 * Math.sin(time / 600), 0]);
    });
    scene.ambientLight = [0.2, 0.2, 0.2];
    renderer.render(scene, camera);
    return renderer;
});
