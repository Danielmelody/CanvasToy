module CanvasToy{
    /*
     * @author Danielhu229 http://hustdanielhu.com
     */
    export class Camera extends Object3d{

        public projectionMatrix:Mat4Array;

        constructor(gl:WebGLRenderingContext){
            super(gl);
            this.projectionMatrix = mat4.create();
        }
    }
}
