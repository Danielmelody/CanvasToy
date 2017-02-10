/// <reference path="../../Object3d.ts"/>
/// <reference path="../../materials/StandardMaterial.ts"/>
/// <reference path="../../geometries/Geometry.ts"/>
/// <reference path="../../Mesh.ts"/>

namespace CanvasToy {
    export class MTLLoader {
        public static load(gl: WebGLRenderingContext, url: string, onload: (materials: any) => void) {
            const materials = {};
            let currentMaterial = null;
            fetchRes(url, (content: string) => {
                content.split("\n").forEach((line) => {
                    currentMaterial = MTLLoader.handleSingleLine(gl, line, materials, currentMaterial);
                });
            });
        }

        protected static removeCommentPattern = /#.*/mg;
        protected static newmtlPattern = /newmtl\s(.+)/mg;
        protected static ambientPattern = /Ka\s(.+)/mg;
        protected static diffusePattern = /Kd\s(.+)/mg;
        protected static specularePattern = /Ks\s(.+)/mg;
        protected static specularExponentPattern = /Ns\s(.+)/mg;
        protected static trancparencyPattern = /(Tr|d)\s(.+)/mg;

        protected static ambientMapPattern = /map_Ka\s(.+)/mg;
        protected static diffuseMapPattern = /map_Kd\s(.+)/mg;
        protected static speculareMapPattern = /map_Ks\s(.+)/mg;
        protected static specularExponentMapPattern = /map_Ns\s(.+)/mg;
        protected static trancparencyMapPattern = /(map_Tr|map_d)\s(.+)/mg;

        protected static bumpPattern = /(map_bump|bump)\s(.+)/mg;
        protected static dispPattern = /disp\s(.+)/mg;
        protected static decalPattern = /decal\s(.+)/mg;

        protected static mapPattern = /(map_|bump|disp|decal).+/mg;

        private static handleSingleLine(
            gl: WebGLRenderingContext,
            line: string,
            materials: any,
            currentMaterial: StandardMaterial,
        ) {
            if (line.length === 0) {
                return;
            }
            const matches = line.match(MTLLoader.removeCommentPattern);
            if (matches.length > 0) {
                line = matches[0];
                const firstVar = line.match(/([^\s]+)/g)[0];

                // TODO: load Texture with generator
                switch(firstVar) {
                    case "newmtl":
                        const mtlName = line.match(MTLLoader.newmtlPattern)[0];
                        materials[mtlName] = new StandardMaterial(gl);
                        break;
                    case "Ka":
                        currentMaterial.ambient = MTLLoader.getVector(MTLLoader.ambientPattern, line);
                        break;
                    case "Kd":
                        currentMaterial.diffuse = MTLLoader.getVector(MTLLoader.diffusePattern, line);
                        break;
                    case "Ks":
                        currentMaterial.specular = MTLLoader.getVector(MTLLoader.specularePattern, line);
                        break;
                    case "Ds":
                        currentMaterial.specularExponent =
                        MTLLoader.getNumber(MTLLoader.specularExponentMapPattern, line);
                        break;
                    default: break;
                }
            }
        }

        private static getVector(pattern: RegExp, line: string) {
            const matches = line.match(pattern);
            const vector = [];
            if (matches.length > 0) {
                matches[0].match(patterns.num).forEach((numStr) => {
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
                return parseFloat(matches[0].match(patterns.num)[0]);
            }
            return 0;
        }
    }
}
