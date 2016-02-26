/// <reference path="../Object3d.ts"/>

module CanvasToy{
    /*
     * @author Danielhu229 http://hustdanielhu.com
     */
    export class Camera extends Object3d{

        public projectionMatrix:Mat4Array;

        constructor(){
            super();
            this.projectionMatrix = mat4.create();
            this.translateTo(0, 0, -10);
        }
    }
}
