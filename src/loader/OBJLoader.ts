/// <reference path="../Object3d.ts"/>
/// <reference path="../materials/Material.ts"/>
/// <reference path="../geometries/Geometry.ts"/>
/// <reference path="../Mesh.ts"/>

namespace CanvasToy {

    export class OBJLoader {

        public static load(gl: WebGLRenderingContext, url: string, onload: (meshes: Object3d) => void) {
            OBJLoader.fetch(url, (content: string) => {
                // remove comment
                content = content.replace(OBJLoader.commentPattern, "");
                const positionlines: string[] = content.match(OBJLoader.vertexPattern);
                const uvlines: string[] = content.match(OBJLoader.uvPattern);
                const normallines: string[] = content.match(OBJLoader.normalPattern);
                const unIndexedPositions = OBJLoader.praiseAttibuteLines(positionlines);
                const unIndexedUVs = OBJLoader.praiseAttibuteLines(uvlines);
                const unIndexedNormals = OBJLoader.praiseAttibuteLines(normallines);
                const container = OBJLoader.buildUpMeshes(
                    gl, content, unIndexedPositions, unIndexedUVs, unIndexedNormals);
                onload(container);
            });
        }

        protected static commentPattern = /#.*/mg;
        protected static numberPattern = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/mg;
        protected static faceSplitVertPattern = /([0-9]|\/|\-)+/g;
        protected static facePerVertPattern = /([0-9]*)\/?([0-9]*)\/?([0-9]*)/;
        protected static objectSplitPattern = /[o|g]\s+.+/mg;
        // protected static materialPattern = /usemtl\s.+/;
        protected static vertexPattern = /v\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)? ?)+/mg;
        protected static uvPattern = /vt\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)? ?)+/mg;
        protected static normalPattern = /vn\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)? ?)+/mg;
        protected static indexPattern = /f\s+([-+]?[0-9]*\.?[0-9]+ ?|\/)+/mg;

        protected static fetch(url: string, onload: (content: string) => void) {
            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4 && request.status === 200) {
                    if (onload) {
                        onload(request.responseText);
                    }
                }
            };
            request.open("GET", url);
            request.send();
        }

        protected static praiseAttibuteLines(lines) {
            const result: number[][] = [];
            if (lines === null) {
                return;
            }
            lines.forEach((expression: string) => {
                const data: number[] = [];
                expression.match(OBJLoader.numberPattern).forEach(
                    (floatNum) => {
                        if (expression !== "") {
                            data.push(parseFloat(floatNum));
                        }
                    },
                );
                result.push(data);
            });
            return result;
        }

        protected static parseAsTriangle(faces: string[], forEachFace: (face: string[]) => void) {
            for (let i = 0; i < faces.length - 2; ++i) {
                const triangleFace = [faces[0], faces[i + 1], faces[i + 2]];
                forEachFace(triangleFace);
            }
        }

        protected static buildUpMeshes(
            gl: WebGLRenderingContext,
            content: string,
            unIndexedPositions: number[][],
            unIndexedUVs: number[][],
            unIndexedNormals: number[][],
        ): Object3d {
            const container: Object3d = new Object3d();
            const objects = content.split(OBJLoader.objectSplitPattern);
            objects.splice(0, 1);
            objects.forEach((objectContent) => {
                const geometry: Geometry = new Geometry(gl);
                const faces = objectContent.match(OBJLoader.indexPattern);
                if (faces !== null) {
                    faces.forEach((faceStr) => {
                        OBJLoader.parseAsTriangle(faceStr.match(OBJLoader.faceSplitVertPattern), (triangleFaces) => {
                            triangleFaces.forEach((perVertData) => {
                                const match = perVertData.match(OBJLoader.facePerVertPattern);
                                console.assert(match !== null && match[1] !== null, "obj file error");
                                const positionIndex = parseInt(match[1], 0) - 1;
                                geometry.faces.data.push(geometry.attributes.position.data.length / 3);
                                geometry.addVertex({
                                    position: unIndexedPositions[positionIndex],
                                    uv: [unIndexedUVs[parseInt(match[2], 0) - 1][0],
                                    unIndexedUVs[parseInt(match[2], 0) - 1][1]],
                                    normal: unIndexedNormals[parseInt(match[3], 0) - 1],
                                });

                            });
                        });
                    });
                }
                const mesh = new Mesh(geometry, [new StandardMaterial(gl)]);
                mesh.setParent(container);
            });
            return container;
        }
    }
}
