import * as CanvasToy from "CanvasToy";
import { vec3 } from "gl-matrix";
import { createCanvas, onMouseOnStart } from "global";

const renderer = new CanvasToy.Renderer(createCanvas());

const scene = new CanvasToy.Scene();
const camera = new CanvasToy.PerspectiveCamera()
    .setPosition(vec3.fromValues(0, 5, 5))
    .lookAt(vec3.fromValues(0, 0, -10));
const checkerBoard = new CanvasToy.StandardMaterial(renderer.gl);
checkerBoard.debug = true;
const objectMaterial = new CanvasToy.StandardMaterial(renderer.gl,
    { mainTexture: new CanvasToy.Texture2D(renderer.gl, "resources/images/wood.jpg") });
// objectMaterial.castShadow = false;
const ground = new CanvasToy.Mesh(new CanvasToy.TileGeometry(renderer.gl).build(), [checkerBoard])
    .setPosition(vec3.fromValues(0, -1, -3)).rotateX(-Math.PI / 2).setScaling(vec3.fromValues(10, 10, 10));
const back = new CanvasToy.Mesh(new CanvasToy.TileGeometry(renderer.gl).build(), [checkerBoard])
    .setPosition(vec3.fromValues(0, 2, -10)).setScaling(vec3.fromValues(5, 5, 5));
const box = new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl).build(), [objectMaterial])
    .setPosition(vec3.fromValues(-2, -1, -5)).setScaling(vec3.fromValues(0.5, 0.5, 0.5));
const sphere = new CanvasToy.Mesh(
    new CanvasToy.SphereGeometry(renderer.gl)
        .setWidthSegments(50)
        .setHeightSegments(50)
        .build(),
    [objectMaterial])
    .setPosition(vec3.fromValues(2, 0, -5)).setScaling(vec3.fromValues(0.5, 0.5, 0.5));
scene.addObject(ground, back, box, sphere, camera);
const directLight = new CanvasToy.DirectionalLight(renderer.gl)
    .setPosition(vec3.fromValues(10, 5, 0))
    .setDirection(vec3.fromValues(-1, -1, 0));
const pointLight = new CanvasToy.PointLight(renderer.gl)
    .setPosition(vec3.fromValues(0, 0, -3)).setIdensity(3).setRadius(8);
const spotLight = new CanvasToy.SpotLight(renderer.gl)
    .setIdensity(600000)
    .setSpotDirection(vec3.fromValues(10, 0, 0))
    .setConeAngle(Math.PI / 4);
scene.addLight(spotLight, directLight);
let time = 0;
scene.addOnUpdateListener((delta) => {
    time += delta;
    spotLight.rotateY(0.02 * Math.cos(time / 600));
    // directLight.translate(vec3.fromValues(0.01, 0, 0));
    box.translate(vec3.fromValues(0, 0.02 * Math.sin(time / 600), 0));
    sphere.translate(vec3.fromValues(0, -0.02 * Math.sin(time / 600), 0));
});
scene.ambientLight = vec3.fromValues(0.2, 0.2, 0.2);
renderer.render(scene, camera);
renderer.stop();
onMouseOnStart(renderer);
