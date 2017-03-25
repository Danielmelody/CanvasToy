/// <reference path="../CanvasToy.ts"/>
/// <reference path="../textures/Texture.ts"/>

namespace CanvasToy {

    export abstract class Light extends Object3d {

        public volume: Geometry;

        @uniform("color", DataType.vec3)
        protected _color = vec3.fromValues(1, 1, 1);

        @uniform("idensity", DataType.float)
        protected _idensity = 1;

        protected _shadowMap: Texture;

        protected _shadowFrameBuffer: FrameBuffer;

        protected _shadowType: ShadowType = ShadowType.Hard;

        protected _projectCamera: Camera;

        protected gl: WebGLRenderingContext;

        constructor(gl: WebGLRenderingContext) {
            super();
            this.gl = gl;
            this.setShadowType(this.shadowType);
        }

        public abstract getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D;

        public setColor(color: Vec3Array) {
            this._color = color;
            return this;
        }

        public setIdensity(idensity: number) {
            this._idensity = idensity;
            return this;
        }

        public setShadowType(shadowType: ShadowType) {
            this._shadowType = shadowType;
            switch (shadowType) {
                case ShadowType.Hard:
                    this.configShadowFrameBuffer();
                    break;
                case ShadowType.Soft:
                    this.configShadowFrameBuffer();
                    break;
                default: break;
            }
            return this;
        }

        public get shadowType() {
            return this._shadowType;
        }

        public get shadowMap() {
            return this._shadowMap;
        }

        public get shadowFrameBuffer() {
            return this._shadowFrameBuffer;
        }

        public get projectCamera() {
            return this._projectCamera;
        }

        public get typename(): string {
            return "Light";
        }

        public get color() {
            return this._color;
        }

        public get idensity() {
            return this._idensity;
        }

        private configShadowFrameBuffer() {
            if (!this._shadowFrameBuffer) {
                this._shadowFrameBuffer = new FrameBuffer(this.gl);
                this._shadowFrameBuffer.attachments.color.disable();
                this._shadowFrameBuffer.attachments.depth.toTexture(this.gl);
                this._shadowMap = this._shadowFrameBuffer.attachments.depth.targetTexture;
            }
        }

    }
}
