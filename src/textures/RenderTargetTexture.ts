namespace CanvasToy {
    export class RenderTargetTexture extends Texture {
        public frameBuffer: WebGLFramebuffer;
        public depthBuffer: WebGLRenderbuffer;
        public stencilBuffer: WebGLRenderbuffer;
        public scene: Scene;
        public camera: Camera;
        constructor(scene: Scene, camera: Camera) {
            super();
            this.scene = scene;
            this.camera = camera;
        }
    }
}
