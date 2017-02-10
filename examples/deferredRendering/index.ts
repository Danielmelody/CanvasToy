/// <reference path="../../build/debug/canvas-toy.d.ts"/>
/// <reference path="../../typings/index.d.ts"/>
/// <reference path="../index.ts"/>

examples.push((canvas: HTMLCanvasElement) => {
    const renderer = new CanvasToy.Renderer(canvas);

    return renderer;
});
