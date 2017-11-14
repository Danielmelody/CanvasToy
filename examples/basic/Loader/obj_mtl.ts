import * as CanvasToy from "CanvasToy";
import { vec3 } from "gl-matrix";
import { createCanvas, createSkyBox, onMouseOnStart } from "global";

const renderer = new CanvasToy.Renderer(createCanvas());
const scene = new CanvasToy.Scene();
const camera = new CanvasToy.PerspectiveCamera()
    .translate(vec3.fromValues(0, 2, 5))
    .lookAt(vec3.create());
const light = new CanvasToy.SpotLight(renderer)
    .translate(vec3.fromValues(-5, 5, 0))
    .setConeAngle(Math.PI / 3)
    .setIdensity(4)
    .rotateX(-Math.PI / 4)
    .rotateY(-Math.PI / 4);
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

scene.addObject(createSkyBox(renderer, skyTexture));

const teapot = CanvasToy.OBJLoader.load(renderer.gl, "resources/models/teapot/teapot.obj");
teapot.setAsyncFinished(teapot.asyncFinished().then(() => {
    const material = (teapot.children[0] as CanvasToy.Mesh).materials[0] as CanvasToy.StandardMaterial;
    material.reflectionMap = skyTexture;
    material.castShadow = true;
    // (teapot.children[0] as CanvasToy.Mesh).materials[0] = new CanvasToy.StandardMaterial(renderer.gl);
    return Promise.resolve(teapot);
}));
teapot.setScaling(vec3.fromValues(0.1, 0.1, 0.1));

scene.addObject(teapot);
camera.lookAt(teapot.position);
let time = 0;
scene.addOnUpdateListener(() => {
    time += 1 / 60;
    teapot.rotateY(0.01);
});
renderer.render(scene, camera);
renderer.stop();
onMouseOnStart(renderer);
