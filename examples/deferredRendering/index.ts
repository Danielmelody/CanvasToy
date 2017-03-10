/// <reference path="../../build/debug/canvas-toy.d.ts"/>
/// <reference path="../../typings/index.d.ts"/>
/// <reference path="../index.ts"/>

examples.push((canvas: HTMLCanvasElement) => {
    const renderer = new CanvasToy.Renderer(canvas);
    const scene = new CanvasToy.Scene();
    const up = vec3.cross(vec3.create(), [1, 0, 0], [0, 0, -40]);
    const camera = new CanvasToy.PerspectiveCamera().setPosition([0, 100, 100]).lookAt([0, 0, -40], up);
    const tile = new CanvasToy.Mesh(
        new CanvasToy.RectGeometry(renderer.gl),
        [new CanvasToy.StandardMaterial(renderer.gl, {
            mainTexture: new CanvasToy.Texture2D(renderer.gl, "resources/images/wood.jpg"),
        })]).translate([0, -10, -40]).rotateX(-Math.PI / 2).setScaling([200, 200, 200]);
    scene.addObject(tile, camera);
    const teapotProto = CanvasToy.OBJLoader.load(renderer.gl, "resources/models/teapot/teapot.obj");
    teapotProto.setAsyncFinished(teapotProto.asyncFinished().then(() => {
        const material = (teapotProto.children[0] as CanvasToy.Mesh).materials[0] as CanvasToy.StandardMaterial;
        material.diffuse = [1, 0.8, 0.2];
        for (let i = 0; i < 40; ++i) {
            const teapot = new CanvasToy.Mesh(
                (teapotProto.children[0] as CanvasToy.Mesh).geometry,
                (teapotProto.children[0] as CanvasToy.Mesh).materials,
            );
            scene.addObject(teapot);
            teapot.translate([(i % 10) * 40 - 200, 0, -40 - Math.floor(i / 10) * 40]);
            let time = 0;
            const spin = 0.03 * (Math.random() - 0.5);
            const light = new CanvasToy.PointLight(renderer.gl)
                .setPosition([Math.random() * 200.0 - 50, 4, Math.random() * 200.0 - 150])
                .setIdensity(0.5)
                .setRadius(50);
            scene.addLight(light);
            const vx = Math.random() * 3;
            const vy = Math.random() * 3;
            teapot.registUpdate(() => {
                time += 1 / 60;
                teapot.rotateY(spin);
                light.translate([-Math.sin(time * vx), 0, -Math.cos(time * vy)]);
            });
        }
        renderer.forceDeferred();
        renderer.render(scene, camera);
        return Promise.resolve(teapotProto);
    }));
    return renderer;
});
