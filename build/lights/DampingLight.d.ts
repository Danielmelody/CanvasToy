import { vec3 } from "gl-matrix";
import { Light } from "./Light";
export declare abstract class DampingLight extends Light {
    get position(): vec3;
    protected _radius: number;
    protected _squareAttenuation: number;
    protected _linearAttenuation: number;
    protected _constantAttenuation: number;
    get squareAttenuation(): number;
    get linearAttenuation(): number;
    get constantAttenuation(): number;
    get radius(): number;
    setSquareAtten(atten: number): this;
    setLinearAtten(atten: number): this;
    setConstAtten(atten: number): this;
    abstract setRadius(radius: number): any;
}
