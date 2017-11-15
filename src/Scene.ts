import { vec3 } from "gl-matrix";
import { DataType } from "./DataTypeEnum";
import { arrayOfStructures, uniform } from "./Decorators";
import { DirectionalLight } from "./lights/DirectionalLight";
import { Light } from "./lights/Light";
import { PointLight } from "./lights/PointLight";
import { SpotLight } from "./lights/SpotLight";
import { Object3d } from "./Object3d";

export class Scene {

    // TODO: optimize objects storage management;
    public objects: Object3d[] = [];

    public lights: Light[] = [];

    @uniform(DataType.vec3, "ambient")
    public ambientLight: vec3 = vec3.fromValues(0.2, 0.2, 0.2);

    public openLight: boolean = false;

    public clearColor: number[] = [0, 0, 0, 0];

    public programSetUp: boolean = false;

    @arrayOfStructures()
    public directLights: DirectionalLight[] = [];

    @arrayOfStructures()
    public pointLights: PointLight[] = [];

    @arrayOfStructures()
    public spotLights: SpotLight[] = [];

    private updateEvents: Array<(deltaTime?: number) => void> = [];

    public update(dt: number) {
        for (const event of this.updateEvents) {
            if (!!event) {
                event(dt);
            }
        }
    }

    public addOnUpdateListener(listener: (deltaTime: number) => void) {
        this.updateEvents.push(listener);
        return this;
    }

    public removeOnUpdateListener(listener: (deltaTime: number) => void) {
        const index = this.updateEvents.indexOf(listener);
        if (index !== -1) {
            // lazy delete
            this.updateEvents[index] = undefined;
        }
        return this;
    }

    public addObject(...objects: Object3d[]) {
        for (const object of objects) {
            if (this.objects.indexOf(object) === -1) {
                this.objects.push(object);
                object.scene = this;
                object.children.forEach((child) => {
                    this.addObject(child);
                });
            }
        }
        return this;
    }

    public removeObject(object: Object3d) {

        object.children.forEach((child) => {
            this.removeObject(child);
        });
        this.objects.splice(this.objects.indexOf(object));
        return this;
    }

    public addLight(...lights: Light[]) {
        this.openLight = true;
        for (const light of lights) {
            this.lights.push(light);
            if (light.typename === "DirectionalLight") {
                this.directLights.push(light as DirectionalLight);
            } else if (light.typename === "PointLight") {
                this.pointLights.push(light as PointLight);
            } else if (light.typename === "SpotLight") {
                this.spotLights.push(light as SpotLight);
            } else {
                console.assert(false, "un-recognize light type: " + light);
            }
            light.scene = this;
        }
    }
}
