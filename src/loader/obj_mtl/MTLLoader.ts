/// <reference path="../../Object3d.ts"/>
/// <reference path="../../materials/StandardMaterial.ts"/>
/// <reference path="../../geometries/Geometry.ts"/>
/// <reference path="../../Mesh.ts"/>

namespace CanvasToy {
    export class MTLLoader {
        public static load(gl: WebGLRenderingContext, baseurl: string) {
            const materials = {};
            let currentMaterial: StandardMaterial = null;
            const home = baseurl.substr(0, baseurl.lastIndexOf("/") + 1);
            return fetchRes(baseurl).then((content: string) => {
                content = content.replace(patterns.commentPattern, "");
                content.split("\n").forEach((line) => {
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
        protected static trancparencyPattern = /(Tr|d)\s(.+)/m;

        protected static mapPattern = /(map_[^\s]+|bump|disp|decal)\s.+/mg;
        protected static mapSinglePattern = /(map_[^\s]+|bump|disp|decal)\s([^\s]+)/m;

        private static handleSingleLine(
            gl: WebGLRenderingContext,
            home: string,
            line: string,
            materials: any,
            currentMaterial: StandardMaterial,
        ) {
            if (line.length === 0) {
                return;
            }
            const firstVar = line.match(/([^\s]+)/g)[0];
            switch (firstVar) {
                case "newmtl":
                    const mtlName = line.match(MTLLoader.newmtlPattern)[1];
                    materials[mtlName] = new StandardMaterial(gl);
                    return materials[mtlName];
                case "Ka":
                    currentMaterial.ambient = MTLLoader.getVector(MTLLoader.ambientPattern, line);
                    break;
                case "Kd":
                    currentMaterial.diffuse = MTLLoader.getVector(MTLLoader.diffusePattern, line);
                    break;
                case "Ks":
                    currentMaterial.specular = MTLLoader.getVector(MTLLoader.specularePattern, line);
                    break;
                case "Ns":
                    currentMaterial.specularExponent =
                        MTLLoader.getNumber(MTLLoader.specularExponentPattern, line);
                    break;
                case "map_Ka":
                    currentMaterial.mainTexture = new Texture2D(gl, home + MTLLoader.getImageUrl(line));
                    break;
                case "map_Ka":
                    currentMaterial.alphaMap = new Texture2D(gl, home + MTLLoader.getImageUrl(line));
                    break;
                case "map_Kd":
                    currentMaterial.mainTexture = new Texture2D(gl, home + MTLLoader.getImageUrl(line));
                    break;
                case "map_bump":
                    currentMaterial.bumpMap = new Texture2D(gl, home + MTLLoader.getImageUrl(line));
                    break;
                case "bump":
                    currentMaterial.bumpMap = new Texture2D(gl, home + MTLLoader.getImageUrl(line));
                    break;
                case "disp":
                    currentMaterial.displamentMap = new Texture2D(gl, home + MTLLoader.getImageUrl(line));
                    break;
                case "decal":
                    currentMaterial.stencilMap = new Texture2D(gl, home + MTLLoader.getImageUrl(line));
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
            return vector;
        }

        private static getNumber(pattern: RegExp, line: string) {
            const matches = line.match(pattern);
            if (matches.length > 0) {
                return parseFloat(matches[1].match(patterns.num)[0]);
            }
            return 0;
        }
    }
}
