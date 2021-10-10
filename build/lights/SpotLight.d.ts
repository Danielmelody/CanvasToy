import { vec3 } from "gl-matrix";
import { Camera } from "../cameras/Camera";
import { BoundingBox2D } from "../Intersections/BoundingBox";
import { Renderer } from "../renderer/Renderer";
import { ProcessingFrameBuffer } from "../renderer/SwapFramebuffer";
import { Texture } from "../textures/Texture";
import { DampingLight } from "./DampingLight";
export declare class SpotLight extends DampingLight {
    protected _coneAngle: number;
    protected _shadowFrameBuffer: ProcessingFrameBuffer;
    constructor(renderer: Renderer);
    get shadowMap(): Texture;
    get shadowFrameBuffer(): ProcessingFrameBuffer;
    get shadowFrameBuffers(): ProcessingFrameBuffer[];
    get spotDirection(): any;
    get coneAngle(): number;
    getDeferredInfo(layer: number, camera: Camera): any[];
    protected get coneAngleCos(): number;
    setRadius(radius: number): this;
    setConeAngle(coneAngle: number): this;
    setSpotDirection(spotDirection: vec3): this;
    setShadowSize(_size: number): this;
    getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D;
    init(render: Renderer): this;
    clearShadowFrameBuffer(): void;
}
