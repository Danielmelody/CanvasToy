import { Camera } from "../cameras/Camera";
import { IMaterial } from "../materials/Material";
import { Scene } from "../Scene";
export interface IProcessor {
    process(scene: Scene, camera: Camera, matriels: IMaterial[]): any;
}
