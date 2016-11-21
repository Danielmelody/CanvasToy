namespace CanvasToy {

    enum BufferForRender {
        Color,
        Depth,
        Stencil
    }

    export class RenderTargetTexture extends Texture {

        public bufferForRender: BufferForRender = BufferForRender.Color;

        public frameBuffer: WebGLFramebuffer;
        public colorBuffer: WebGLRenderbuffer;
        public depthBuffer: WebGLRenderbuffer;
        public stencilBuffer: WebGLRenderbuffer;

        public enableColorBuffer: boolean = true;
        public enableDepthBuffer: boolean = false;
        public enableStencilBuffer: boolean = false;

        public get renderBuffer(): WebGLRenderbuffer {
            switch(this.bufferForRender) {
                case BufferForRender.Color:
                return this.colorBuffer;
                case BufferForRender.Depth:
                return this.depthBuffer;
                case BufferForRender.Stencil:
                return this.stencilBuffer;
                default:
                return this.colorBuffer;
            }
        }

        constructor() {
            super();
        }
    }
}
