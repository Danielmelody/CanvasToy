/// <reference path="../Scene.ts"/>
/// <reference path="../cameras/Camera.ts"/>

namespace CanvasToy {
    export interface IProcessor {
        process(scene: Scene, camera: Camera, matriels: IMaterial[]);
    };
}
