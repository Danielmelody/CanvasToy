import * as CanvasToy from "CanvasToy";
import { vec3 } from "gl-matrix";
import { createCanvas, onMouseOnStart } from "global";

const renderer = new CanvasToy.Renderer(createCanvas());
const scene = new CanvasToy.Scene();
const camera = new CanvasToy.PerspectiveCamera()
    .setPosition(vec3.fromValues(0, 100, 100))
    .lookAt(vec3.fromValues(0, 0, -40));
const tile = new CanvasToy.Mesh(
    new CanvasToy.RectGeometry(renderer.gl),
    [new CanvasToy.StandardMaterial(renderer.gl, {
        mainTexture: new CanvasToy.Texture2D(renderer.gl, "resources/images/wood.jpg"),
    })]).translate(vec3.fromValues(0, -10, -40)).rotateX(-Math.PI / 2).setScaling(vec3.fromValues(200, 200, 200));
scene.addObject(tile, camera);
const teapotProto = CanvasToy.OBJLoader.load(renderer.gl, "resources/models/teapot/teapot.obj");
teapotProto.setAsyncFinished(teapotProto.asyncFinished().then(() => {
    const material = (teapotProto.children[0] as CanvasToy.Mesh).materials[0] as CanvasToy.StandardMaterial;
    material.diffuse = vec3.fromValues(1, 0.8, 0.2);
    material.castShadow = false;
    for (let i = 0; i < 40; ++i) {
        const teapot = new CanvasToy.Mesh(
            (teapotProto.children[0] as CanvasToy.Mesh).geometry,
            (teapotProto.children[0] as CanvasToy.Mesh).materials,
        );
        scene.addObject(teapot);
        teapot.translate(vec3.fromValues((i % 10) * 40 - 200, 0, -40 - Math.floor(i / 10) * 40));
        let time = 0;
        const spin = 0.03 * (Math.random() - 0.5);
        const light = new CanvasToy.PointLight(renderer)
            .setPosition(vec3.fromValues(Math.random() * 200.0 - 50, 4, Math.random() * 200.0 - 150))
            .setIdensity(0.5)
            .setRadius(50);
        scene.addLight(light);
        const vx = Math.random() * 3;
        const vy = Math.random() * 3;
        scene.addOnUpdateListener(() => {
            time += 1 / 60;
            teapot.rotateY(spin);
            light.translate(vec3.fromValues(-Math.sin(time * vx), 0, -Math.cos(time * vy)));
        });
    }
    renderer.forceDeferred();
    renderer.render(scene, camera);
    return Promise.resolve(teapotProto);
}));
