import { vec3 } from "gl-matrix";
import { Camera } from "../cameras/Camera";
import { BoundingBox2D } from "../Intersections/BoundingBox";
import { Renderer } from "../renderer/Renderer";
import { ProcessingFrameBuffer } from "../renderer/SwapFramebuffer";
import { IBuildinRenderParamMaps } from "../shader/Program";
import { CubeTexture } from "../textures/CubeTexture";
import { DampingLight } from "./DampingLight";
import { ShadowLevel } from "./ShadowLevel";
export declare class PointLight extends DampingLight {
    private _spotLights;
    private _cubeTexture;
    constructor(renderer: Renderer);
    get shadowMap(): CubeTexture;
    get shadowFrameBuffers(): ProcessingFrameBuffer[];
    get projectionMatrix(): any;
    get far(): number;
    get near(): number;
    getDeferredInfo(layer: number, renderCamera: Camera): any[];
    setColor(color: vec3): this;
    setIdensity(idensity: number): this;
    setShadowLevel(shadowLevel: ShadowLevel): this;
    setShadowSize(shadowSize: number): this;
    setShadowSoftness(_shadowSoftness: number): this;
    setPCSSArea(_pcssArea: number): this;
    setRadius(radius: number): this;
    init(renderer: any): this;
    drawWithLightCamera(renderParam: IBuildinRenderParamMaps): void;
    clearShadowFrameBuffer(): void;
    getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D;
}
