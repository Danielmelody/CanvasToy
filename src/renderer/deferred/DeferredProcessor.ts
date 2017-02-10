/// <reference path="../FrameBuffer"/>
/// <reference path="./GBuffer"/>

namespace CanvasToy {
    export class DeferredProcessor {
        public geometryBuffer: GeometryBuffer;
        constructor(gl: WebGLRenderingContext, scene: Scene) {
            this.geometryBuffer = new GeometryBuffer(gl);
        }
    }
}
