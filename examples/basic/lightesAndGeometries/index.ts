import * as CanvasToy from "CanvasToy";
import { vec3 } from "gl-matrix";
import { createCanvas, onMouseOnStart } from "global";

const renderer = new CanvasToy.Renderer(createCanvas());

const scene = new CanvasToy.Scene();
const center = new CanvasToy.Object3d();
const camera = new CanvasToy.PerspectiveCamera()
    .setParent(center)
    .translate(vec3.fromValues(0, 10, 10))
    .rotateX(-Math.PI / 4);
const checkerBoard = new CanvasToy.StandardMaterial(renderer.gl);
checkerBoard.debug = true;
const objectMaterial = new CanvasToy.StandardMaterial(renderer.gl,
    { mainTexture: new CanvasToy.Texture2D(renderer.gl, "resources/images/wood.jpg") });
// objectMaterial.castShadow = false;
const ground = new CanvasToy.Mesh(new CanvasToy.TileGeometry(renderer.gl).build(), [checkerBoard])
    .setPosition(vec3.fromValues(0, -2, 0)).rotateX(-Math.PI / 2).setScaling(vec3.fromValues(10, 10, 10));

const box = new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl).build(), [objectMaterial])
    .setPosition(vec3.fromValues(-2, -1, 0)).setScaling(vec3.fromValues(0.5, 0.5, 0.5));
const sphere = new CanvasToy.Mesh(
    new CanvasToy.SphereGeometry(renderer.gl)
        .setWidthSegments(50)
        .setHeightSegments(50)
        .build(),
    [objectMaterial])
    .setPosition(vec3.fromValues(2, 0, 0)).setScaling(vec3.fromValues(0.5, 0.5, 0.5));
const directLight = new CanvasToy.DirectionalLight(renderer)
    .setIdensity(0.3)
    .translate(vec3.fromValues(0, 6, 1))
    .rotateX(-Math.PI / 2)
    .rotateY(-Math.PI / 4);
// .setConeAngle(Math.PI / 3);
const spotLight = new CanvasToy.SpotLight(renderer)
    .setIdensity(8)
    .translate(vec3.fromValues(0, 5, 5))
    .rotateX(-Math.PI / 4)
    .setConeAngle(Math.PI / 6);

scene.addLight(spotLight, directLight);
scene.addObject(ground, box, sphere, center, camera);
let time = 0;
// spotLight.translate(vec3.fromValues(0, 0, 0.01));

scene.addOnUpdateListener((delta) => {
    time += delta;
    box.translate(vec3.fromValues(0, 0.02 * Math.sin(time / 400), 0));
    sphere.translate(vec3.fromValues(0, -0.02 * Math.sin(time / 400), 0));
    center.rotateY(0.01);
});
scene.ambientLight = vec3.fromValues(0.2, 0.2, 0.2);
renderer.render(scene, camera);
renderer.stop();
onMouseOnStart(renderer);
