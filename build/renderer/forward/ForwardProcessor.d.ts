import { Camera } from "../../cameras/Camera";
import { IMaterial } from "../../materials/Material";
import { Scene } from "../../Scene";
import { WebGLExtension } from "../IExtension";
import { IProcessor } from "../IProcessor";
export declare class ForwardProcessor implements IProcessor {
    readonly gl: WebGLRenderingContext;
    readonly ext: WebGLExtension;
    constructor(gl: WebGLRenderingContext, ext: WebGLExtension, scene: Scene, camera: Camera);
    process(scene: Scene, camera: Camera, materials: IMaterial[]): void;
    private renderObject;
}
