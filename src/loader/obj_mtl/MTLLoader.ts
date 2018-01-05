import { vec3 } from "gl-matrix";

import { BlinnPhongMaterial } from "../../materials/BlinnPhongMaterial";
import { StandardMaterial } from "../../materials/StandardMaterial";
import { Texture2D } from "../../textures/Texture2D";
import { fetchRes } from "../ResourceFetcher";
import { patterns } from "./CommonPatterns";

export class MTLLoader {
    public static load(gl: WebGLRenderingContext, baseurl: string) {
        const materials = {};
        let currentMaterial: BlinnPhongMaterial | StandardMaterial = null;
        const home = baseurl.substr(0, baseurl.lastIndexOf("/") + 1);
        return fetchRes(baseurl).then((content: string) => {
            content = content.replace(patterns.commentPattern, "");
            content.split("\n").filter((line) => !!line).forEach((line) => {
                currentMaterial = MTLLoader.handleSingleLine(gl, home, line, materials, currentMaterial);
            });
            return Promise.resolve(materials);
        });
    }

    protected static newmtlPattern = /newmtl\s(.+)/m;
    protected static ambientPattern = /Ka\s(.+)/m;
    protected static diffusePattern = /Kd\s(.+)/m;
    protected static specularePattern = /Ks\s(.+)/m;
    protected static specularExponentPattern = /Ns\s(.+)/m;

    protected static metallicPattern = /Pm\s(.+)/m;
    protected static roughnessPattern = /Pr\s(.+)/m;

    protected static mapPattern = /(map_[^\s]+|bump|disp|decal)\s.+/mg;
    protected static mapSinglePattern = /(map_[^\s]+|bump|disp|decal)\s([^\s]+)/m;

    private static handleSingleLine(
        gl: WebGLRenderingContext,
        home: string,
        line: string,
        materials: any,
        currentMaterial: BlinnPhongMaterial | StandardMaterial,
    ) {
        const matches = line.match(/([^\s]+)/g);
        if (!matches || matches.length === 0) {
            return;
        }
        const firstVar = matches[0];
        switch (firstVar) {
            case "newmtl":
                const mtlName = line.match(MTLLoader.newmtlPattern)[1];
                materials[mtlName] = new BlinnPhongMaterial(gl);
                return materials[mtlName];
            case "Ka":
                currentMaterial.setAmbient(MTLLoader.getVector(MTLLoader.ambientPattern, line));
                break;
            case "Kd":
                if (currentMaterial instanceof BlinnPhongMaterial) {
                    currentMaterial.setDiffuse(MTLLoader.getVector(MTLLoader.diffusePattern, line));
                } else if (currentMaterial instanceof StandardMaterial) {
                    currentMaterial.setAlbedo(MTLLoader.getVector(MTLLoader.diffusePattern, line));
                }
                break;
            case "Ks":
                if (currentMaterial instanceof BlinnPhongMaterial) {
                    currentMaterial.setSpecular(MTLLoader.getVector(MTLLoader.specularePattern, line));
                }
                break;
            case "Ns":
                if (currentMaterial instanceof BlinnPhongMaterial) {
                    currentMaterial.setSpecularExponent(MTLLoader.getNumber(MTLLoader.specularExponentPattern, line));
                }
                break;
            case "map_Ka":
                currentMaterial.setMainTexture(new Texture2D(gl, home + MTLLoader.getImageUrl(line)));
                break;
            case "map_Ka":
                currentMaterial.setAlphaMap(new Texture2D(gl, home + MTLLoader.getImageUrl(line)));
                break;
            case "map_Kd":
                currentMaterial.setMainTexture(new Texture2D(gl, home + MTLLoader.getImageUrl(line)));
                break;
            case "map_bump":
                currentMaterial.setBumpMap(new Texture2D(gl, home + MTLLoader.getImageUrl(line)));
                break;
            case "bump":
                currentMaterial.setBumpMap(new Texture2D(gl, home + MTLLoader.getImageUrl(line)));
                break;
            case "disp":
                currentMaterial.setDisplamentMap(new Texture2D(gl, home + MTLLoader.getImageUrl(line)));
                break;
            case "decal":
                currentMaterial.setStencilMap(new Texture2D(gl, home + MTLLoader.getImageUrl(line)));
                break;
            case "Pr":
                if (currentMaterial instanceof BlinnPhongMaterial) {
                    currentMaterial = StandardMaterial.fromLaggard(gl, currentMaterial);
                }
                currentMaterial.setRoughness(MTLLoader.getNumber(MTLLoader.roughnessPattern, line));
                break;
            case "Pm":
                if (currentMaterial instanceof BlinnPhongMaterial) {
                    currentMaterial = StandardMaterial.fromLaggard(gl, currentMaterial);
                }
                currentMaterial.setMetallic(MTLLoader.getNumber(MTLLoader.metallicPattern, line));
                break;
            default: break;
        }
        return currentMaterial;
    }

    private static getImageUrl(line) {
        const matches = line.match(MTLLoader.mapSinglePattern);
        return matches[2];
    }

    private static getVector(pattern: RegExp, line: string) {
        const matches = line.match(pattern);
        const vector = [];
        if (matches.length > 0) {
            matches[1].match(patterns.num).forEach((numStr) => {
                if (numStr !== "") {
                    vector.push(parseFloat(numStr));
                }
            });
        }
        return vec3.fromValues(vector[0], vector[1], vector[2]);
    }

    private static getNumber(pattern: RegExp, line: string) {
        const matches = line.match(pattern);
        if (matches.length > 0) {
            return parseFloat(matches[1].match(patterns.num)[0]);
        }
        return 0;
    }
}
