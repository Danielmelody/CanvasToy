/// <reference path="./Light.ts"/>
namespace CanvasToy {
    export class PointLight extends Light {
        constructor(gl: WebGLRenderingContext) {
            super();
            this._projectCamera = new PerspectiveCamera();
            this._volume = new SphereGeometry(gl).setRadius(100).build();
        }
    }
}
