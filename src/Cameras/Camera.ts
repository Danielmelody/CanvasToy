/// <reference path="../Node.ts"/>

module CanvasToy {
    /*
     * @author Danielhu229 http://hustdanielhu.com
     */
    export class Camera extends Node {
        public projectionMatrix: Mat4Array;
        constructor() {
            super();
            this.projectionMatrix = mat4.create();
        }
    }
}
