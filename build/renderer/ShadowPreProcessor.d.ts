import { Camera } from "../cameras/Camera";
import { IMaterial } from "../materials/Material";
import { Scene } from "../Scene";
import { WebGLExtension } from "./IExtension";
import { IProcessor } from "./IProcessor";
export declare class ShadowPreProcess implements IProcessor {
    private gl;
    private ext;
    private depthMaterial;
    private blurMaterial;
    private rectMesh;
    constructor(gl: WebGLRenderingContext, ext: WebGLExtension, scene: Scene);
    process(scene: Scene, camera: Camera, matriels: IMaterial[]): void;
    private renderDepth;
    private prefiltDepth;
}
