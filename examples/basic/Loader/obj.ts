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
    light.setPosition([100, 0, 100]);
    light.setColor([1, 1, 1]);

    scene.addLight(light);

    const woodImage = new Image();
    woodImage.src = "basic/images/wood.jpg";

    const wood = new CanvasToy.StandardMaterial(renderer.gl, {
        mainTexture: new CanvasToy.Texture2D(renderer.gl, woodImage)
            .setFormat(renderer.gl.RGB)
            .setWrapS(renderer.gl.REPEAT)
            .setWrapT(renderer.gl.REPEAT),
        specular: [0.1, 0.1, 0.1],
    });
    CanvasToy.OBJLoader.load(renderer.gl, "basic/models/teapot.obj", (object) => {
        scene.addObject(object);
        scene.addObject(camera);
        scene.addObject(camera2);
        camera.translate([0, -8, 0]);
        camera2.translate([0, -8, 0]);
        camera2.rotateZ(Math.PI);
        for (const childObj of object.children) {
            const child = childObj as CanvasToy.Mesh;
            child.materials = [wood];
        }
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
});
