import { vec3 } from "gl-matrix";
import { BlinnPhongMaterial } from "../../materials/surface/BlinnPhongMaterial";
import { StandardMaterial } from "../../materials/surface/StandardMaterial";
import { Texture2D } from "../../textures/Texture2D";
import { fetchRes } from "../ResourceFetcher";
import { patterns } from "./CommonPatterns";
var MTLLoader = (function () {
    function MTLLoader() {
    }
    MTLLoader.load = function (gl, baseurl) {
        var materials = {};
        var currentMaterial = null;
        var home = baseurl.substr(0, baseurl.lastIndexOf("/") + 1);
        return fetchRes(baseurl).then(function (content) {
            content = content.replace(patterns.commentPattern, "");
            content
                .split("\n")
                .filter(function (line) { return !!line; })
                .forEach(function (line) {
                currentMaterial = MTLLoader.handleSingleLine(gl, home, line, materials, currentMaterial);
            });
            return Promise.resolve(materials);
        });
    };
    MTLLoader.handleSingleLine = function (gl, home, line, materials, currentMaterial) {
        var matches = line.match(/([^\s]+)/g);
        if (!matches || matches.length === 0) {
            return;
        }
        var firstVar = matches[0];
        switch (firstVar) {
            case "newmtl":
                var mtlName = line.match(MTLLoader.newmtlPattern)[1];
                materials[mtlName] = new BlinnPhongMaterial(gl);
                materials[mtlName].name = mtlName;
                return materials[mtlName];
            case "Ka":
                currentMaterial.setAmbient(MTLLoader.getVector(MTLLoader.ambientPattern, line));
                break;
            case "Kd":
                if (currentMaterial instanceof BlinnPhongMaterial) {
                    currentMaterial.setDiffuse(MTLLoader.getVector(MTLLoader.diffusePattern, line));
                }
                else if (currentMaterial instanceof StandardMaterial) {
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
            case "map_Kd":
                currentMaterial.setMainTexture(new Texture2D(gl, home + MTLLoader.getImageUrl(line)));
                break;
            case "map_d":
                currentMaterial.setAlphaMap(new Texture2D(gl, home + MTLLoader.getImageUrl(line)));
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
                    materials[currentMaterial.name] = currentMaterial;
                }
                currentMaterial.setRoughness(MTLLoader.getNumber(MTLLoader.roughnessPattern, line));
                break;
            case "Pm":
                if (currentMaterial instanceof BlinnPhongMaterial) {
                    currentMaterial = StandardMaterial.fromLaggard(gl, currentMaterial);
                    materials[currentMaterial.name] = currentMaterial;
                }
                currentMaterial.setMetallic(MTLLoader.getNumber(MTLLoader.metallicPattern, line));
                break;
            default:
                break;
        }
        return currentMaterial;
    };
    MTLLoader.getImageUrl = function (line) {
        var matches = line.match(MTLLoader.mapSinglePattern);
        return matches[2];
    };
    MTLLoader.getVector = function (pattern, line) {
        var matches = line.match(pattern);
        var vector = [];
        if (matches.length > 0) {
            matches[1].match(patterns.num).forEach(function (numStr) {
                if (numStr !== "") {
                    vector.push(parseFloat(numStr));
                }
            });
        }
        return vec3.fromValues(vector[0], vector[1], vector[2]);
    };
    MTLLoader.getNumber = function (pattern, line) {
        var matches = line.match(pattern);
        if (matches.length > 0) {
            return parseFloat(matches[1].match(patterns.num)[0]);
        }
        return 0;
    };
    MTLLoader.newmtlPattern = /newmtl\s(.+)/m;
    MTLLoader.ambientPattern = /Ka\s(.+)/m;
    MTLLoader.diffusePattern = /Kd\s(.+)/m;
    MTLLoader.specularePattern = /Ks\s(.+)/m;
    MTLLoader.specularExponentPattern = /Ns\s(.+)/m;
    MTLLoader.metallicPattern = /Pm\s(.+)/m;
    MTLLoader.roughnessPattern = /Pr\s(.+)/m;
    MTLLoader.mapPattern = /(map_[^\s]+|bump|disp|decal)\s.+/gm;
    MTLLoader.mapSinglePattern = /(map_[^\s]+|bump|disp|decal)\s([^\s]+)/m;
    return MTLLoader;
}());
export { MTLLoader };
//# sourceMappingURL=MTLLoader.js.map