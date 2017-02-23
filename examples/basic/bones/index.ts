/// <reference path="../../../build/debug/canvas-toy.d.ts"/>
/// <reference path="../../../typings/index.d.ts"/>
/// <reference path="../../index.ts"/>

examples.push((canvas: HTMLCanvasElement) => {
    const renderer = new CanvasToy.Renderer(canvas);

    const scene = new CanvasToy.Scene();
    const camera = new CanvasToy.PerspectiveCamera();

    const mainTexture = new CanvasToy.Texture2D(renderer.gl, "resources/images/wood.jpg");

    const material = new CanvasToy.StandardMaterial(renderer.gl, { mainTexture });

    const meshes: CanvasToy.Object3d[] = [];

    for (let i = 0; i < 4; ++i) {
        const mesh = new CanvasToy.Mesh(
            new CanvasToy.SphereGeometry(renderer.gl).setWidthSegments(20).setHeightSegments(20).build(),
            [material],
        );
        if (i > 0) {
            mesh.setParent(meshes[i - 1]);
            if (i === 3) {
                mesh.setLocalPosition([0, 2.5 - i / 4.0, 0]);
            } else {
                mesh.setLocalPosition([2.5 - i / 4.0, 0, 0]);
            }
        }
        const scaleFactor = Math.pow(2, (1 - i));
        mesh.setScaling([scaleFactor, scaleFactor, scaleFactor]);
        meshes.push(mesh);
    }

    meshes[0].translate([0, -2, -10]);

    meshes[0].registUpdate(() => {
        meshes[0].rotateY(-0.005);
        meshes[1].rotateY(0.01);
        meshes[2].rotateX(0.05);
    });

    scene.addObject(meshes[0]);
    scene.addObject(camera);
    camera.rotateX(-0.2);
    const light = new CanvasToy.PointLight(renderer.gl).setPosition([100, 0, 100]);
    scene.addLight(light);
    renderer.render(scene, camera);
    console.log(scene);
    return renderer;
});
