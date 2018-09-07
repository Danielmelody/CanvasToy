import { vec2, vec3 } from "gl-matrix";

export function mixin(toObject: {}, fromObject: {}) {
    for (const property in fromObject) {
        if (toObject[property] instanceof Object) {
            mixin(toObject[property], fromObject[property]);
        } else {
            toObject[property] = fromObject[property];
        }
    }
}

export function getDomScriptText(script: HTMLScriptElement): string {

    if (!script) {
        return null;
    }

    let theSource = "";
    let currentChild = script.firstChild;

    while (currentChild) {
        if (currentChild.nodeType === 3) {
            theSource += currentChild.textContent;
        }

        currentChild = currentChild.nextSibling;
    }

    // Send the source to the shader object

}

function octWrap(inVec: vec2, outVec) {
    outVec[0] = (1.0 - Math.abs(inVec[1])) * (inVec[0] >= 0.0 ? 1.0 : -1.0);
    outVec[1] = (1.0 - Math.abs(inVec[0])) * (inVec[1] >= 0.0 ? 1.0 : -1.0);
}

export function encodeNormal(inVec: vec3, outVec: vec2 = vec2.create()) {
    inVec = vec3.scale(vec3.create(), inVec, Math.abs(outVec[0]) + Math.abs(outVec[1]) + Math.abs(outVec[2]));
    if (inVec[2] < 0.0) {
        const temp = vec2.fromValues(inVec[0], inVec[1]);
        octWrap(temp, outVec);
        outVec = temp;
    }
    vec2.scaleAndAdd(outVec, outVec, vec2.fromValues(0.5, 0.5), 0.5);
    return outVec;
}

export function decodeNormal(inVec: vec2, outVec: vec3 = vec3.create()) {
    inVec = vec2.scaleAndAdd(vec2.create(), inVec, vec2.fromValues(0.5, 0.5), 0.5);
    // https://twitter.com/Stubbesaurus/status/937994790553227264
    const n = vec3.fromValues(inVec[0], inVec[1], 1.0 - Math.abs(inVec[0]) - Math.abs(inVec[1]));
    const t = Math.max(0.0, Math.min(1.0, -n[2]));
    n[0] += n[0] >= 0.0 ? -t : t;
    n[1] += n[1] >= 0.0 ? -t : t;
    vec3.normalize(outVec, n);
    return outVec;
}
