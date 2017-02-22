/// <reference path="../../../build/debug/canvas-toy.d.ts"/>
/// <reference path="../../../typings/index.d.ts"/>
/// <reference path="../../index.ts"/>

examples.push((canvas: HTMLCanvasElement) => {
    const renderer = new CanvasToy.Renderer(canvas);

    const scene = new CanvasToy.Scene();
    const camera = new CanvasToy.PerspectiveCamera();

    // const skybox = createSkyBox(renderer, new CanvasToy.CubeTexture(
    //     renderer.gl,
    //     "resources/images/skybox/ashcanyon_rt.jpg",
    //     "resources/images/skybox/ashcanyon_lf.jpg",
    //     "resources/images/skybox/ashcanyon_up.jpg",
    //     "resources/images/skybox/ashcanyon_dn.jpg",
    //     "resources/images/skybox/ashcanyon_bk.jpg",
    //     "resources/images/skybox/ashcanyon_ft.jpg",
    // )).setParent(camera);

    const cube = new CanvasToy.Mesh(
        new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.StandardMaterial(renderer.gl, {
            specular: [0.1, 0.1, 0.1],
            mainTexture: new CanvasToy.Texture2D(renderer.gl, "resources/images/chrome.png"),
        })]);
    cube.translate([-2, 0, -6]);

    const sphere = new CanvasToy.Mesh(
        new CanvasToy.SphereGeometry(renderer.gl)
            .setRadius(1.5)
            .setWidthSegments(100)
            .setHeightSegments(100)
            .build(),
        [new CanvasToy.StandardMaterial(renderer.gl, {
            specular: [0.1, 0.1, 0.1],
            mainTexture: new CanvasToy.Texture2D(renderer.gl, "resources/images/wood.jpg"),
        })]);

    sphere.translate([2, 0, -6]);

    scene.addObject(cube).addObject(sphere).addObject(camera);

    scene.ambientLight = [0.1, 0.1, 0.1];
    const light = new CanvasToy.PointLight(renderer.gl);

    scene.addLight(light);

    let time = 0;

    cube.registUpdate((delta) => {
        time += delta;
        cube.rotateY(0.01);
        sphere.rotateX(0.01);
        light.setPosition([-10, 30 * Math.sin(time / 200), 100]);
    });
    renderer.render(scene, camera);
    return renderer;
});
