/// <reference path="./Light.ts"/>
namespace CanvasToy {
    export class PointLight extends Light {
        constructor() {
            super();
            this.projectCamera = new PerspectiveCamera();
        }
    }
}
