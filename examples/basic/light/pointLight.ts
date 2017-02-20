/// <reference path="../../../build/debug/canvas-toy.d.ts"/>
/// <reference path="../../../typings/index.d.ts"/>
/// <reference path="../../index.ts"/>

function createSkyBox(renderer: CanvasToy.Renderer, cubeTexture) {
    return new CanvasToy.Mesh(
        new CanvasToy.CubeGeometry(renderer.gl),
        [new CanvasToy.SkyMaterial(renderer.gl, cubeTexture)],
    );
}

examples.push((canvas: HTMLCanvasElement) => {
    const renderer = new CanvasToy.Renderer(canvas);

    const scene = new CanvasToy.Scene();
    const camera = new CanvasToy.PerspectiveCamera();

    const skybox = createSkyBox(renderer, new CanvasToy.CubeTexture(
        renderer.gl,
        "resources/images/skybox/ashcanyon_rt.jpg",
        "resources/images/skybox/ashcanyon_lf.jpg",
        "resources/images/skybox/ashcanyon_up.jpg",
        "resources/images/skybox/ashcanyon_dn.jpg",
        "resources/images/skybox/ashcanyon_bk.jpg",
        "resources/images/skybox/ashcanyon_ft.jpg",
    )).setParent(camera);

    const cube = new CanvasToy.Mesh(
        new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.StandardMaterial(renderer.gl, {
            specular: [0.1, 0.1, 0.1],
            mainTexture: new CanvasToy.Texture2D(renderer.gl, "resources/images/chrome.png"),
        })]);
    cube.translate([0, 0, -6]);
    scene.addObject(cube).addObject(camera);

    scene.ambientLight = [0.1, 0.1, 0.1];
    const light = new CanvasToy.PointLight().setPosition([100, 0, 100]);

    scene.addLight(light);

    cube.registUpdate(() => {
        cube.rotateY(0.01);
    });
    renderer.render(scene, camera);
    return renderer;
});
