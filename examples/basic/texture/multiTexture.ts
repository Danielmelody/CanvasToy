/// <reference path="../../../build/debug/canvas-toy.d.ts"/>
/// <reference path="../../../typings/index.d.ts"/>
/// <reference path="../../index.ts"/>

// examples.push((canvas: HTMLCanvasElement) => {
//     const renderer = new CanvasToy.Renderer(canvas);
//     const scene = new CanvasToy.Scene();
//     scene.ambientLight = vec3.fromValues(0.2, 0.1, 0.1);
//     const camera = new CanvasToy.PerspectiveCamera().setPosition([0, 0, 1]);
//     const light = new CanvasToy.PointLight();
//     light.setIdensity(1)
//         .setPosition([100, 0, 100]);
//     const image1 = new Image();
//     image1.src = "basic/images/sea.jpg";
//
//     const image2 = new Image();
//     image2.src = "basic/images/chrome.png";
//
//     const cube = new CanvasToy.Mesh(
//         new CanvasToy.CubeGeometry(renderer.gl),
//         [new CanvasToy.StandardMaterial(renderer.gl,
//             { mainTexture: new CanvasToy.Texture2D(renderer.gl, image1) },
//         )],
//     );
//     cube.translate([0, 0, -10]);
//     scene.addLight(light);
//     scene.addObject(camera);
//     scene.addObject(cube);
//     return renderer;
// });
