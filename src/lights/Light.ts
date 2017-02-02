/// <reference path="../CanvasToy.ts"/>
/// <reference path="../textures/Texture.ts"/>

namespace CanvasToy {

    export abstract class Light extends Object3d {

        @uniform("color", DataType.vec3)
        protected _color = vec3.fromValues(1, 1, 1);

        @uniform("idensity", DataType.float)
        protected _idensity = 1.0;

        @uniform("position", DataType.vec3)
        protected _position: Vec3Array = vec3.create();

        protected _shadowRtt: Texture;

        protected _projectCamera: Camera;

        constructor() {
            super();
        }

        public setColor(color: Vec3Array) {
            this._color = color;
            return this;
        }

        public setIdensity(idensity: number) {
            this._idensity = idensity;
            return this;
        }

        public get color() {
            return this._color;
        }

        public get idensity() {
            return this._idensity;
        }

    }
}
