/// <reference path="../Node.ts"/>

module CanvasToy {
    /*
     * @author Danielhu229 http://hustdanielhu.com
     */
    export abstract class Camera extends Node {
        public projectionMatrix: Mat4Array;
        constructor() {
            super();
            this.projectionMatrix = mat4.create();
        }
        public abstract adaptTargetRadio(target: { width: number, height: number });
    }
}
