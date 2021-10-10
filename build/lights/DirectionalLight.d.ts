import { vec3 } from "gl-matrix";
import { Camera } from "../cameras/Camera";
import { BoundingBox2D } from "../Intersections/BoundingBox";
import { Renderer } from "../renderer/Renderer";
import { ProcessingFrameBuffer } from "../renderer/SwapFramebuffer";
import { Texture } from "../textures/Texture";
import { Light } from "./Light";
export declare class DirectionalLight extends Light {
    protected _shadowFrameBuffer: ProcessingFrameBuffer;
    constructor(renderer: Renderer);
    get shadowMap(): Texture;
    get shadowFrameBuffers(): ProcessingFrameBuffer[];
    get direction(): vec3;
    getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D;
    setDirection(_direction: vec3): this;
    setShadowSize(_size: number): this;
    clearShadowFrameBuffer(): void;
    protected init(renderer: Renderer): this;
}
