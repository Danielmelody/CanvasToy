/// <reference path="../CanvasToy.ts"/>
///

function builder(_thisArg: any) {
    return _thisArg;
}

namespace CanvasToy {
    export class Texture {

        public readonly glTexture: WebGLTexture;
        public dataCompleted: boolean = false;
        public isReadyToUpdate: boolean = false;

        private _unit: number;
        private _image: HTMLImageElement;
        private _target: number;
        private _format: number;
        private _wrapS: number;
        private _wrapT: number;
        private _magFilter: number;
        private _minFilter: number;
        private _type: number;

        constructor(
            gl: WebGLRenderingContext,
            image?: HTMLImageElement,
        ) {
            this.setTarget(gl.TEXTURE_2D)
                .setFormat(gl.RGB)
                .setWrapS(gl.CLAMP_TO_EDGE)
                .setWrapT(gl.CLAMP_TO_EDGE)
                .setMagFilter(gl.NEAREST)
                .setMinFilter(gl.NEAREST)
                .setType(gl.UNSIGNED_BYTE);
            this.glTexture = gl.createTexture();
            this._image = image;
        }

        public get unit() {
            return this._unit;
        }

        public get image() {
            return this._image;
        }

        public get target() {
            return this._target;
        }

        public get format() {
            return this._format;
        }

        public get wrapS() {
            return this._wrapS;
        }

        public get wrapT() {
            return this._wrapT;
        }

        public get magFilter() {
            return this._magFilter;
        }

        public get minFilter() {
            return this._minFilter;
        }

        public get type() {
            return this._type;
        }

        public setUnit(_unit: number) {
            this._unit = _unit;
            return this;
        }

        public setImage(_image: HTMLImageElement) {
            this._image = _image;
            return this;
        }

        public setTarget(_target: number) {
            this._target = _target;
            return this;
        }

        public setFormat(_format: number) {
            this._format = _format;
            return this;
        }

        public setWrapS(_wrapS: number) {
            this._wrapS = _wrapS;
            return this;
        }

        public setWrapT(_wrapT: number) {
            this._wrapT = _wrapT;
            return this;
        }

        public setMagFilter(_magFilter: number) {
            this._magFilter = _magFilter;
            return this;
        }

        public setMinFilter(_minFilter: number) {
            this._minFilter = _minFilter;
            return this;
        }

        public setType(_type: number) {
            this._type = _type;
            return this;
        }

        public setUpTextureData(gl: WebGLRenderingContext) {
            if (this.dataCompleted) {
                return false;
            }
            this.dataCompleted = true;
            return true;
        }
    }
}
