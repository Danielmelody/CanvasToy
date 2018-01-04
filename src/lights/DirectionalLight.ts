import { mat4, quat, vec3 } from "gl-matrix";
import { Camera } from "../cameras/Camera";
import { OrthoCamera } from "../cameras/OrthoCamera";
import { DataType } from "../DataTypeEnum";
import { uniform } from "../Decorators";
import { BoundingBox2D } from "../Intersections/BoundingBox";
import { FrameBuffer } from "../renderer/FrameBuffer";
import { Renderer } from "../renderer/Renderer";
import { ProcessingFrameBuffer } from "../renderer/SwapFramebuffer";
import { Texture } from "../textures/Texture";
import { Light } from "./Light";

export class DirectionalLight extends Light {

    protected _shadowFrameBuffer: ProcessingFrameBuffer;

    constructor(renderer: Renderer) {
        super(renderer);
        this.setShadowSize(1024);
    }

    public get shadowMap() {
        return this._shadowFrameBuffer.active.attachments.color.targetTexture;
    }

    public get shadowFrameBuffers() {
        return [this._shadowFrameBuffer];
    }

    @uniform(DataType.vec3)
    public get direction(): vec3 {
        return vec3.transformQuat(vec3.create(), vec3.fromValues(0, 0, -1),
            mat4.getRotation(quat.create(), this._matrix),
        );
    }

    public getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D {
        return {
            left: -1,
            right: 1,
            top: 1,
            bottom: -1,
        };
    }

    public setDirection(_direction: vec3) {
        const lookPoint = vec3.add(vec3.create(), this._position, _direction);
        this.lookAt(lookPoint);
        return this;
    }

    public setShadowSize(_size: number) {
        super.setShadowSize(_size);
        if (this._shadowFrameBuffer !== null) {
            this._shadowFrameBuffer.setWidth(_size).setHeight(_size).attach(this.gl);
        }
        return this;
    }

    public clearShadowFrameBuffer() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._shadowFrameBuffer.active.glFramebuffer);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clearColor(this.far, 0, 0, 0);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
    }

    protected init(renderer: Renderer) {
        if (!this._shadowFrameBuffer) {
            this._shadowFrameBuffer = new ProcessingFrameBuffer(this.gl)
                .onInit((frameBuffer: FrameBuffer) => {
                    frameBuffer
                        .setWidth(this._shadowSize)
                        .setHeight(this._shadowSize);
                    frameBuffer.attachments.color.targetTexture
                        .setType(this.gl.FLOAT)
                        .setFormat(this.gl.RGBA)
                        .setMinFilter(this.gl.NEAREST)
                        .setMagFilter(this.gl.NEAREST)
                        .setWrapS(this.gl.REPEAT)
                        .setWrapT(this.gl.REPEAT)
                        .apply(this.gl);
                    frameBuffer.attach(this.gl);
                },
            );
        }
        this._projectCamera = new OrthoCamera()
            .setParent(this)
            .setLocalPosition(vec3.create())
            .setAspectRadio(1);
        return this;
    }
}
