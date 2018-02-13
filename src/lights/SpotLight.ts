import { mat4, quat, vec3 } from "gl-matrix";
import { Camera } from "../cameras/Camera";
import { PerspectiveCamera } from "../cameras/PerspectiveCamera";
import { DataType } from "../DataTypeEnum";
import { uniform } from "../Decorators";
import { BoundingBox2D } from "../Intersections/BoundingBox";
import { FrameBuffer } from "../renderer/FrameBuffer";
import { Renderer } from "../renderer/Renderer";
import { ProcessingFrameBuffer } from "../renderer/SwapFramebuffer";
import { Texture } from "../textures/Texture";
import { DampingLight } from "./DampingLight";

export class SpotLight extends DampingLight {

    protected _coneAngle: number;

    protected _shadowFrameBuffer: ProcessingFrameBuffer;

    constructor(renderer: Renderer) {
        super(renderer);
        this.setConeAngle(Math.PI / 8);
        this.setRadius(100);
    }

    public get shadowMap() {
        return this._shadowFrameBuffer.active.attachments.color.targetTexture;
    }

    public get shadowFrameBuffer(): ProcessingFrameBuffer {
        return this._shadowFrameBuffer;
    }

    public get shadowFrameBuffers() {
        return [this._shadowFrameBuffer];
    }

    @uniform(DataType.vec3, "spotDir")
    public get spotDirection() {
        return vec3.transformQuat(vec3.create(), vec3.fromValues(0, 0, -1),
            mat4.getRotation(quat.create(), this._matrix),
        );
    }

    public get coneAngle() {
        return this._coneAngle;
    }

    @uniform(DataType.float)
    protected get coneAngleCos(): number {
        return Math.cos(this._coneAngle);
    }

    public setRadius(radius: number) {
        this._radius = radius;
        return this;
    }

    public setConeAngle(coneAngle: number) {
        console.assert(coneAngle > 0, "coneAngle should greater than 0!");
        this._coneAngle = coneAngle;
        (this._projectCamera as PerspectiveCamera).setFovy(coneAngle * 2);
        return this;
    }

    public setSpotDirection(spotDirection: vec3) {
        const lookPoint = vec3.add(vec3.create(), this.position, spotDirection);
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

    public getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D {
        // TODO: implements bounding box for spot light.
        console.error("function getProjecttionBoundingBox2D has not been init");
        return {
            left: -1,
            right: 1,
            top: 1,
            bottom: -1,
        };
    }

    public init(render: Renderer) {
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
        this._projectCamera = new PerspectiveCamera()
            .setParent(this)
            .setLocalPosition(vec3.create())
            .setAspectRadio(1);
        return this;
    }

    public clearShadowFrameBuffer() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._shadowFrameBuffer.active.glFramebuffer);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clearColor(this.far, 0, 0, 0);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
    }

}
