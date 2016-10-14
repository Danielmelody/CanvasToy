/// <reference path="./Light.ts"/>

namespace CanvasToy {
    export class DirectionalLight extends Light {
        private _direction: Vec3Array = vec3.fromValues(1, 1, 1);
        public get direction(): Vec3Array {
            return this._direction;
        }
        public set direction(_direction: Vec3Array) {
            vec3.normalize(this._direction, _direction);
        }

        constructor() {
            super();
        }
    }
}
