module CanvasToy{
    export interface Drawable{
        draw:(gl:WebGLRenderingContext, camera:Camera) => void;
    }
}
