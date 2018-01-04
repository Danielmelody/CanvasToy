import * as CanvasToy from "CanvasToy";
import { vec3 } from "gl-matrix";
import { createCanvas, onMouseOnStart } from "global";

const renderer = new CanvasToy.Renderer(createCanvas());

const scene = new CanvasToy.Scene();
const camera = new CanvasToy.PerspectiveCamera();

const mainTexture = new CanvasToy.Texture2D(renderer.gl, "resources/images/wood.jpg");

const material = new CanvasToy.StandardMaterial(renderer.gl).setMainTexture(mainTexture);

const meshes: CanvasToy.Object3d[] = [];

for (let i = 0; i < 4; ++i) {
    const mesh = new CanvasToy.Mesh(
        new CanvasToy.SphereGeometry(renderer.gl).setWidthSegments(50).setHeightSegments(50).build(),
        // new CanvasToy.CubeGeometry(renderer.gl),
        [material],
    );
    if (i > 0) {
        mesh.setParent(meshes[i - 1]);
        if (i === 3) {
            mesh.setLocalPosition(vec3.fromValues(0, 2.5 - i / 4.0, 0));
        } else {
            mesh.setLocalPosition(vec3.fromValues(2.5 - i / 4.0, 0, 0));
        }
    }
    const scaleFactor = Math.pow(2, (1 - i));
    mesh.setScaling(vec3.fromValues(scaleFactor, scaleFactor, scaleFactor));
    meshes.push(mesh);
}

meshes[0].translate(vec3.fromValues(0, -2, -10));

camera.rotateX(-0.2);

const light = new CanvasToy.DirectionalLight(renderer)
    .rotateY(Math.PI / 3)
    .setPosition(vec3.fromValues(10, -2, -10));
let t = 0;

scene.addOnUpdateListener((dt) => {
    meshes[0].rotateY(-0.005);
    meshes[1].rotateY(0.01);
    meshes[2].rotateX(0.05);
    t += dt;
    // light.rotateZ(dt / 1000.0);
});

scene.addObject(meshes[0], camera);
scene.addLight(light);
renderer.render(scene, camera);
renderer.stop();
onMouseOnStart(renderer);
