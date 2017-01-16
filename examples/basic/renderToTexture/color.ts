/// <reference path="../../../build/debug/canvas-toy.d.ts"/>
/// <reference path="../../../typings/index.d.ts"/>
/// <reference path="../../index.ts"/>

examples.push((canvas: HTMLCanvasElement) => {
    const renderer = new CanvasToy.Renderer(canvas);
    const scenes = Array(2, 0).map(() => new CanvasToy.Scene());
    const cameras = Array(2, 0).map(() => new CanvasToy.PerspectiveCamera());
    const light = new CanvasToy.PointLight();
    const cubes = [new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.Material(renderer.gl)])];
    cameras[0].position = [0, 0, 5];
    scenes[0].ambientLight = vec3.fromValues(0.2, 0.1, 0.1);
    light.idensity = 1;
    light.position = [100, 0, 100];
    light.diffuse = [1, 1, 1];
    light.specular = [1, 1, 0.3];
    scenes[0].addLight(light);
    scenes[0].addObject(cameras[0]);
    scenes[0].addObject(cubes[0]);

    const fbo = renderer.createFrameBuffer();

    fbo.enableRenderBuffer(renderer.gl, CanvasToy.BufferUsage.Color);

    const rttTexture = fbo.getRenderBuffer(CanvasToy.BufferUsage.Color).toTexture(renderer.gl);

    cubes.push(new CanvasToy.Mesh(new CanvasToy.CubeGeometry(renderer.gl), [new CanvasToy.Material(renderer.gl, {
        mainTexture: rttTexture,
    })]));
    cubes[0].registUpdate(() => {
        cubes.forEach((cube) => {
            cube.rotateY(0.01);
        });
    });
    cameras[1].position = [0, 0, 5];
    scenes[1].addLight(light);
    scenes[0].addLight(light);
    scenes[1].addObject(cameras[1]);
    scenes[1].addObject(cubes[1]);
    renderer.renderFBO(scenes[0], cameras[0]);
    renderer.render(scenes[1], cameras[1]);
});
