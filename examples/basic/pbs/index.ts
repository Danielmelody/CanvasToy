import * as CanvasToy from "CanvasToy";
import { vec3 } from "gl-matrix";
import { createCanvas, createSkyBox, onMouseOnStart } from "global";

const renderer = new CanvasToy.Renderer(createCanvas());

const scene = new CanvasToy.Scene();
const camera = new CanvasToy.PerspectiveCamera().setPosition(vec3.fromValues(0, 0, 20));

const skyTexture = new CanvasToy.CubeTexture(
    renderer.gl,
    {
        xpos: "resources/images/skybox/arid2_rt.jpg",
        xneg: "resources/images/skybox/arid2_lf.jpg",
        ypos: "resources/images/skybox/arid2_up.jpg",
        yneg: "resources/images/skybox/arid2_dn.jpg",
        zpos: "resources/images/skybox/arid2_bk.jpg",
        zneg: "resources/images/skybox/arid2_ft.jpg",
    },
);

scene.addObject(createSkyBox(renderer, skyTexture));

for (let i = 0; i < 5; ++i) {
    for (let j = 0; j < 5; ++j) {
        const mesh = new CanvasToy.Mesh(
            new CanvasToy.SphereGeometry(renderer.gl).setWidthSegments(50).setHeightSegments(50).build(),
            // new CanvasToy.CubeGeometry(renderer.gl),
            [new CanvasToy.StandardMaterial(renderer.gl)
                .setEnvironmentMap(skyTexture)
                .setRecieveShadow(false)
                .setCastShadow(false)
                .setMetallic((i + 0.5) / 5.0)
                .setRoughness((j + 0.5) / 5.0),
                // .setAlbedo(vec3.fromValues(1, 1, 0)),
            ],
        );
        mesh.setPosition(vec3.fromValues((i - 2) * 3, (j - 2) * 3, 0));
        scene.addObject(mesh);
    }
}

const light = new CanvasToy.DirectionalLight(renderer)
    .rotateY(Math.PI / 3)
    .setPosition(vec3.fromValues(5, 0, -5))
    .setShadowLevel(CanvasToy.ShadowLevel.None)
    .lookAt(vec3.create());

scene.addOnUpdateListener(() => {
    light.rotateY(0.01);
});

scene.addLight(light);
renderer.render(scene, camera);
renderer.stop();
onMouseOnStart(renderer);
