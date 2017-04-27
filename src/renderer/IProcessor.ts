import { Camera } from "../cameras/Camera";
import { Material } from "../materials/Material";
import { Scene } from "../Scene";

export interface IProcessor {
    process(scene: Scene, camera: Camera, matriels: Material[]);
}
