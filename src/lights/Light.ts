import { mat4, vec3 } from "gl-matrix";

import { Camera } from "../cameras/Camera";
import { DataType } from "../DataTypeEnum";
import { define, ifdefine, ifgreat, texture, uniform } from "../Decorators";
import { Geometry } from "../geometries/Geometry";
import { BoundingBox2D } from "../Intersections/BoundingBox";
import { Object3d } from "../Object3d";
import { FrameBuffer } from "../renderer/FrameBuffer";
import { WebGLExtension } from "../renderer/IExtension";
import { Renderer } from "../renderer/Renderer";
import { ProcessingFrameBuffer } from "../renderer/SwapFramebuffer";
import { IBuildinRenderParamMaps } from "../shader/Program";
import { Texture } from "../textures/Texture";
import { ShadowLevel } from "./ShadowLevel";

export abstract class Light extends Object3d {

    public volume: Geometry;

    protected _color = vec3.fromValues(1, 1, 1);

    protected _idensity = 1;

    protected _pcssArea: number = 5;

    @uniform(DataType.int, "shadowLevel")
    protected _shadowLevel: ShadowLevel = ShadowLevel.PCSS;

    @uniform(DataType.float, "softness")
    protected _shadowSoftness = 1.0;

    protected _projectCamera: Camera;

    protected _shadowSize: number = 512;

    protected gl: WebGLRenderingContext;

    protected ext: WebGLExtension;

    constructor(renderer: Renderer) {
        super();
        this.gl = renderer.gl;
        this.ext = renderer.ext;
        this.init(renderer);
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

    public setShadowLevel(shadowLevel: ShadowLevel) {
        this._shadowLevel = shadowLevel;
        return this;
    }

    public setShadowSize(shadowSize: number) {
        this._shadowSize = shadowSize;
        return this;
    }

    public setShadowSoftness(_shadowSoftness: number) {
        this._shadowSoftness = _shadowSoftness;
        return this;
    }

    public setPCSSArea(_pcssArea: number) {
        this._pcssArea = _pcssArea;
        return this;
    }

    public get shadowLevel() {
        return this._shadowLevel;
    }

    public get shadowSoftness() {
        return this._shadowSoftness;
    }

    @ifdefine("RECEIVE_SHADOW")
    @uniform(DataType.float, "shadowMapSize")
    public get shadowSize() {
        return this._shadowSize;
    }

    public abstract get shadowMap(): Texture;

    @uniform(DataType.vec3)
    public get color() {
        return this._color;
    }

    @uniform(DataType.float)
    public get idensity() {
        return this._idensity;
    }

    @ifdefine("RECEIVE_SHADOW")
    @uniform(DataType.mat4)
    public get projectionMatrix() {
        return this._projectCamera.projectionMatrix;
    }

    @ifdefine("RECEIVE_SHADOW")
    @uniform(DataType.mat4)
    public get viewMatrix() {
        return this._worldToObjectMatrix;
    }

    @uniform(DataType.float, "lightArea")
    public get pcssArea() {
        return this._pcssArea;
    }

    public get far() {
        return this._projectCamera.far;
    }

    public get near() {
        return this._projectCamera.near;
    }

    /**
     * Get all shadow framebuffers owned by this light,
     * as some type of Light may have more than one shadow frameBuffer
     */
    public abstract get shadowFrameBuffers(): ProcessingFrameBuffer[];

    public drawWithLightCamera(renderParam: IBuildinRenderParamMaps) {
        renderParam.camera = this._projectCamera;
        renderParam.light = this;
        renderParam.material.shader.pass(renderParam);
    }

    public abstract clearShadowFrameBuffer();

    protected abstract init(render: Renderer);
}
