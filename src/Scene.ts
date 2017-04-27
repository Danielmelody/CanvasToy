import { mat2, mat2d, mat3, mat4, quat, vec2, vec3, vec4 } from "gl-matrix";
import { DataType } from "./DataTypeEnum";
import { textureArray, uniformArray } from "./Decorators";
import { DirectionalLight } from "./lights/DirectionalLight";
import { Light } from "./lights/Light";
import { PointLight } from "./lights/PointLight";
import { SpotLight } from "./lights/SpotLight";
import { Object3d } from "./Object3d";
import { CubeTexture } from "./textures/CubeTexture";
import { Texture2D } from "./textures/Texture2D";

export class Scene {

    // TODO: optimize objects storage management;
    public objects: Object3d[] = [];

    public lights: Light[] = [];

    public pointLights: PointLight[] = [];

    public spotLights: SpotLight[] = [];

    public dirctionLights: DirectionalLight[] = [];

    @textureArray("pointShadowMaps")
    public pointShadowMaps: CubeTexture[] = [];
    @uniformArray("pointShadowMatrices", DataType.mat4)
    public pointShadowMatrices: Float32Array = new Float32Array([]);

    @textureArray("spotShadowMaps")
    public spotShadowMaps: Texture2D[] = [];
    @uniformArray("spotShadowMatrices", DataType.mat4)
    public spotShadowMatrices: Float32Array = new Float32Array([]);

    @textureArray("directionShadowMaps")
    public directionShadowMaps: Texture2D[] = [];
    @uniformArray("directShadowMatrices", DataType.mat4)
    public directShadowMatrices: Float32Array = new Float32Array([]);

    public ambientLight: vec3 = vec3.fromValues(0, 0, 0);

    public openLight: boolean = false;

    public clearColor: number[] = [0, 0, 0, 0];

    public programSetUp: boolean = false;

    protected updateEvents: Function[] = [];

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
                this.dirctionLights.push(light as DirectionalLight);
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
