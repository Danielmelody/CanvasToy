/// <reference path="./Camera.ts"/>

module CanvasToy{
    export class PerspectiveCamera extends Camera{
        constructor(options?){
            super();
            this.projectionMatrix = mat4.perspective(this.projectionMatrix, 45, 640/480, 0.1, 200);
        }
    }
}
