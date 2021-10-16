import { vec2, vec3 } from "gl-matrix";
export declare function mixin(toObject: {}, fromObject: {}): void;
export declare function getDomScriptText(script: HTMLScriptElement): string;
export declare function encodeNormal(inVec: vec3, outVec?: vec2): vec2;
export declare function decodeNormal(inVec: vec2, outVec?: vec3): vec3;
