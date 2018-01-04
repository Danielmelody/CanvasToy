import { vec3 } from "gl-matrix";
import { DataType } from "./DataTypeEnum";
import { arrayOfStructures, textureArray, uniform } from "./Decorators";
import { IDirtyable } from "./Dirtyable";
import { DirectionalLight } from "./lights/DirectionalLight";
import { Light } from "./lights/Light";
import { PointLight } from "./lights/PointLight";
import { SpotLight } from "./lights/SpotLight";
import { Object3d } from "./Object3d";
import { Texture } from "./textures/Texture";

export class Scene implements IDirtyable {

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

    private _directLightShadowMap: Texture[] = [];
    private _spotLightShadowMap: Texture[] = [];

    private _directShadowDirty = true;
    private _pointShadowDirty = true;
    private _spotShadowDirty = true;

    @textureArray()
    public get directLightShadowMap() {
        this.clean();
        return this._directLightShadowMap;
    }

    @textureArray()
    public get spotLightShadowMap() {
        this.clean();
        return this._spotLightShadowMap;
    }

    public clean() {
        if (this._directShadowDirty) {
            this._directLightShadowMap = this.directLights.map((light) => light.shadowMap);
            this._directShadowDirty = false;
        }
        if (this._spotShadowDirty) {
            this._spotLightShadowMap = this.spotLights.map((light) => light.shadowMap);
            this._spotShadowDirty = false;
        }
    }

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
        const addonDirect = lights.filter((light) => light instanceof DirectionalLight) as DirectionalLight[];
        this.directLights = this.directLights.concat(addonDirect);
        this._directShadowDirty = (addonDirect.length > 0);
        const addonPoint = lights.filter(
            (light) => light instanceof PointLight && !(light instanceof SpotLight)) as PointLight[];
        this.pointLights = this.pointLights.concat(addonPoint);
        this._pointShadowDirty = addonPoint.length > 0;
        const addonSpot = lights.filter((light) => light instanceof SpotLight) as SpotLight[];
        this.spotLights = this.spotLights.concat(addonSpot);
        this._spotShadowDirty = (addonSpot.length > 0);
        this.lights = this.lights.concat(lights);
    }
}
