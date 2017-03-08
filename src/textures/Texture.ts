/// <reference path="../CanvasToy.ts"/>
///

function builder(_thisArg: any) {
    return _thisArg;
}

namespace CanvasToy {
    export class Texture implements IAsyncResource {

        public readonly glTexture: WebGLTexture;
        public isReadyToUpdate: boolean = false;

        protected _asyncFinished: Promise<Texture>;
        protected readonly _image: HTMLImageElement;

        private _target: number;
        private _format: number;
        private _wrapS: number;
        private _wrapT: number;
        private _magFilter: number;
        private _minFilter: number;
        private _type: number;

        constructor(
            gl: WebGLRenderingContext,
            url?: string,
        ) {
            if (!!url) {
                this._image = new Image();
                const image = this._image;
                this.setAsyncFinished(new Promise((resolve, reject) => {
                    image.onload = () => resolve(this);
                    image.onerror = () => reject(this);
                    this._image.src = url;
                }));
            }
            this.setTarget(gl.TEXTURE_2D)
                .setFormat(gl.RGB)
                .setWrapS(gl.CLAMP_TO_EDGE)
                .setWrapT(gl.CLAMP_TO_EDGE)
                .setMagFilter(gl.NEAREST)
                .setMinFilter(gl.NEAREST)
                .setType(gl.UNSIGNED_BYTE);
            this.glTexture = gl.createTexture();
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

        public setAsyncFinished(promise: Promise<Texture>) {
            this._asyncFinished = promise;
        }

        public asyncFinished() {
            return this._asyncFinished;
        };

        public setUpTextureData(gl: WebGLRenderingContext) { }
    }
}
