import { mat4, quat, vec3, vec4 } from "gl-matrix";
import { Camera } from "../cameras/Camera";
import { DataType } from "../DataTypeEnum";
import { uniform } from "../Decorators";
import { Geometry } from "../geometries/Geometry";
import { BoundingBox2D } from "../Intersections/BoundingBox";
import { Object3d } from "../Object3d";
import { AttachmentType, FrameBuffer } from "../renderer/FrameBuffer";
import { WebGLExtension } from "../renderer/IExtension";
import { Renderer} from "../renderer/Renderer";
import { Texture } from "../textures/Texture";
import { ShadowType } from "./ShadowType";

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

    protected abstract setUpProjectionCamera();

    protected configShadowFrameBuffer() {
        if (!this._shadowFrameBuffer) {
            this._shadowFrameBuffer = new FrameBuffer(this.gl).setWidth(1024).setHeight(1024);
            this._shadowMap = this._shadowFrameBuffer.attachments.color.targetTexture
                .setType(this.gl.UNSIGNED_BYTE)
                .setFormat(this.gl.RGBA)
                .setMinFilter(this.gl.LINEAR)
                .setMagFilter(this.gl.LINEAR)
                .setWrapS(this.gl.REPEAT)
                .setWrapT(this.gl.REPEAT)
                .bindTextureData(this.gl);
            this._shadowFrameBuffer.attach(this.gl);
        }
        return this;
    }
}
