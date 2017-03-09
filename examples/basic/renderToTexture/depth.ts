/// <reference path="../../../build/debug/canvas-toy.d.ts"/>
/// <reference path="../../../typings/index.d.ts"/>
/// <reference path="../../index.ts"/>
// 
// examples.push((canvas: HTMLCanvasElement) => {
//     const renderer = new CanvasToy.Renderer(canvas);
//     renderer.gl.enable(renderer.gl.CULL_FACE);
//     const scenes = Array(2, 0).map(() => new CanvasToy.Scene());
//     const cameras = Array(2, 0).map(() => new CanvasToy.PerspectiveCamera());
//     const light = new CanvasToy.PointLight();
//     const cube = new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl),
//         [new CanvasToy.StandardMaterial(renderer.gl)]).rotateY(2).translate([0, 0, -3]);
//
//     const image = new Image();
//     cube.materials[0].mainTexture = new CanvasToy.Texture2D(renderer.gl, "resources/images/chrome.png")
//         .setFormat(renderer.gl.RGBA);
//
//     scenes[0].ambientLight = vec3.fromValues(0.1, 0.1, 0.1);
//     scenes[1].ambientLight = vec3.fromValues(0.1, 0.1, 0.1);
//     light.setPosition([100, 0, 100]);
//     scenes[0].addLight(light).addObject(cameras[0]).addObject(cube);
//
//     const fbo = renderer.createFrameBuffer();
//     fbo.attachments.color.disable();
//     fbo.attachments.depth
//         .setType(renderer.gl, CanvasToy.AttachmentType.Texture)
//         .targetTexture
//         .setType(renderer.gl.UNSIGNED_SHORT)
//         .setFormat(renderer.gl.DEPTH_COMPONENT);
//
//     const rttTexture = fbo.attachments.depth.targetTexture;
//
//     const depthMaterial = new CanvasToy.StandardMaterial(renderer.gl, { mainTexture: rttTexture });
//     depthMaterial.program = new CanvasToy.StandardShaderBuilder()
//         .setInterplotationMethod(CanvasToy.InterplotationMethod.DepthPhong)
//         .build(renderer.gl);
//
//     const rect = new CanvasToy.Mesh(
//         new CanvasToy.RectGeometry(renderer.gl),
//         [depthMaterial]).setScaling([canvas.width / canvas.height, 1, 1]);
//     cube.registUpdate(() => {
//         cube.rotateY(0.02);
//     });
//     cameras[0].setNear(1);
//     cameras[1].setPosition([0, 0, 2]);
//     scenes[1].addLight(light).addObject(cameras[1]).addObject(rect);
//     scenes[0].addLight(light);
//     renderer.renderFBO(scenes[0], cameras[0]);
//     renderer.render(scenes[1], cameras[1]);
//
//     depthMaterial.program.addUniform("cameraNear", {
//         type: CanvasToy.DataType.float,
//         updator: (obj, camera: CanvasToy.PerspectiveCamera) => camera.near,
//     });
//     depthMaterial.program.addUniform("cameraFar", {
//         type: CanvasToy.DataType.float,
//         updator: (obj, camera: CanvasToy.PerspectiveCamera) => camera.far,
//     });
//     return renderer;
// });
