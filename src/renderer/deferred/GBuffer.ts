/// <reference path="../FrameBuffer"/>

namespace CanvasToy {

    export class GeometryBuffer {

        public positionTexture: Texture;

        public normalTexture: Texture;

        public colorTexture: Texture;

        public depthTexture: Texture;

        constructor(gl: WebGLRenderingContext) {
            this.positionTexture = new Texture(gl);
            this.normalTexture = new Texture(gl);
            this.colorTexture = new Texture(gl);
        }

        public depth(gl: WebGLRenderingContext) {
            this.depthTexture = new Texture(gl);
        }
    }
}
