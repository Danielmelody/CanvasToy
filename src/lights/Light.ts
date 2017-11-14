import { mat4, quat, vec3, vec4 } from "gl-matrix";
import { Mesh } from "Mesh";
import { Camera } from "../cameras/Camera";
import { DataType } from "../DataTypeEnum";
import { bindUniformGetter, ifdefine, texture, uniform } from "../Decorators";
import { Geometry } from "../geometries/Geometry";
import { BoundingBox2D } from "../Intersections/BoundingBox";
import { Material } from "../materials/Material";
import { Object3d } from "../Object3d";
import { AttachmentType, FrameBuffer } from "../renderer/FrameBuffer";
import { Graphics } from "../renderer/GraphicsUtils";
import { WebGLExtension } from "../renderer/IExtension";
import { Renderer } from "../renderer/Renderer";
import { IBuildinRenderParamMaps } from "../shader/Program";
import { Texture } from "../textures/Texture";
import { ShadowType } from "./ShadowType";

export abstract class Light extends Object3d {

    public volume: Geometry;

    protected _color = vec3.fromValues(1, 1, 1);

    protected _idensity = 1;

    protected _shadowMap: Texture;

    protected _shadowFrameBuffer: FrameBuffer;

    protected _blurFrameBuffer: FrameBuffer;

    protected _shadowType: ShadowType = ShadowType.Soft;

    protected _projectCamera: Camera;

    protected _shadowSize: number = 1024;

    protected gl: WebGLRenderingContext;

    protected ext: WebGLExtension;

    constructor(renderer: Renderer) {
        super();
        this.gl = renderer.gl;
        this.ext = renderer.ext;
        this.configShadowFrameBuffer();
        this.setUpProjectionCamera();
    }

    public abstract getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D;

    public setColor(color: vec3) {
        this._color = color;
        return this;
    }

    public setIdensity(idensity: number) {
        this._idensity = idensity;
        return this;
    }

    public setShadowType(shadowType: ShadowType) {
        this._shadowType = shadowType;
        return this;
    }

    public setShadowSize(shadowSize: number) {
        if (shadowSize !== this._shadowSize) {
            this._shadowSize = shadowSize;
        }
        if (this._shadowFrameBuffer !== null) {
            this._shadowFrameBuffer.setWidth(this._shadowSize);
            this._shadowFrameBuffer.setHeight(this._shadowSize);
        }
        if (this._blurFrameBuffer !== null) {
            this._blurFrameBuffer.setWidth(this._shadowSize);
            this._blurFrameBuffer.setHeight(this._shadowSize);
        }
        return this;
    }

    public get shadowType() {
        return this._shadowType;
    }

    @ifdefine("USE_SHADOW")
    @uniform(DataType.float, "shadowMapSize")
    public get shadowSize() {
        return this._shadowSize;
    }

    @ifdefine("USE_SHADOW")
    @texture()
    public get shadowMap() {
        return this._shadowMap;
    }

    public get shadowFrameBuffer() {
        return this._shadowFrameBuffer;
    }

    public get blurFrameBuffer() {
        return this._blurFrameBuffer;
    }

    public get typename(): string {
        return "Light";
    }

    @uniform(DataType.vec3)
    public get color() {
        return this._color;
    }

    @uniform(DataType.float)
    public get idensity() {
        return this._idensity;
    }

    @ifdefine("USE_SHADOW")
    @uniform(DataType.mat4)
    public get projectionMatrix() {
        return this._projectCamera.projectionMatrix;
    }

    @ifdefine("USE_SHADOW")
    @uniform(DataType.mat4)
    public get viewMatrix() {
        return this._worldToObjectMatrix;
    }

    public get far() {
        return this._projectCamera.far;
    }

    public get near() {
        return this._projectCamera.near;
    }

    public drawWithLightCamera(renderParam: IBuildinRenderParamMaps) {
        renderParam.camera = this._projectCamera;
        renderParam.material.shader.pass(renderParam);
    }

    protected abstract setUpProjectionCamera();

    protected configShadowFrameBuffer() {
        if (!this._shadowFrameBuffer) {
            this._shadowFrameBuffer = new FrameBuffer(this.gl).setWidth(this._shadowSize).setHeight(this._shadowSize);
            this._shadowMap = this._shadowFrameBuffer.attachments.color.targetTexture
                .setType(this.gl.FLOAT)
                .setFormat(this.gl.RGBA)
                .setMinFilter(this.gl.NEAREST)
                .setMagFilter(this.gl.NEAREST)
                .setWrapS(this.gl.REPEAT)
                .setWrapT(this.gl.REPEAT)
                .apply(this.gl);
            this._shadowFrameBuffer.attach(this.gl);
        }
        if (!this._blurFrameBuffer) {
            this._blurFrameBuffer = new FrameBuffer(this.gl).setWidth(this._shadowSize).setHeight(this._shadowSize);
            this._blurFrameBuffer.attachments.color.targetTexture
                .setType(this.gl.FLOAT)
                .setFormat(this.gl.RGBA)
                .setMagFilter(this.gl.NEAREST)
                .setMinFilter(this.gl.NEAREST)
                .setWrapS(this.gl.CLAMP_TO_EDGE)
                .setWrapT(this.gl.CLAMP_TO_EDGE)
                .apply(this.gl);
            this._blurFrameBuffer.attach(this.gl);
        }
        return this;
    }
}
