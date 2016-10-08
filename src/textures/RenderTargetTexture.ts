namespace CanvasToy {
    export class RenderTargetTexture extends Texture {
        public frameBuffer: WebGLFramebuffer;
        public depthBuffer: WebGLRenderbuffer;
        public stencilBuffer: WebGLRenderbuffer;
        constructor(public scene: Scene, public camera: Camera) {
            super();
        }
    }
}
