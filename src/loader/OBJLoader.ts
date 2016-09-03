/// <reference path="../geometries/Geometry.ts"/>
/// <reference path="../materials/Material.ts"/>
module CanvasToy {

    /*
     for details of Wavefront .obj file ,see http://www.martinreddy.net/gfx/3d/OBJ.spec
    */

    export module OBJLoader {

        var commentPattern = /\#.*/mg;
        var numberPattern = /([0-9]|\.|\-|e)+/g;
        var faceSplitVertPattern = /([0-9]|\/|\-)+/g;
        var facePerVertPattern = /([0-9]*)\/?([0-9]*)\/?([0-9]*)/
        var objectSplitPattern = /[o|g]\s+.+/mg;
        var materialPattern = /usemtl\s.+/;
        var vertexPattern = /v\s+([0-9]|\s|\.|\-|e)+/mg;
        var uvPattern = /vt\s+([0-9]|\s|\.|\-|e)+/mg;
        var normalPattern = /vn\s+([0-9]|\s|\.|\-|e)+/mg;
        var indexPattern = /f\s+([0-9]|\s|\/|\-)+/mg;

        function fetch(url: string, onload: (content: string) => void) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState == 4 && request.status == 200) {
                    if (onload) {
                        onload(request.responseText);
                    }
                }
            };
            request.open('GET', url);
            request.send();
        }

        function praiseAttibuteLines(lines) {
            let result: Array<Array<number>> = [];
            if (lines == null) {
                return;
            }
            lines.forEach((expression: string) => {
                let data: Array<number> = [];
                expression.match(numberPattern).forEach(
                    (expression) => {
                        if (expression != "") {
                            data.push(parseFloat(expression));
                        }
                    }
                );
                result.push(data);
            });
            return result;
        }

        function fillAVertex(target: Array<number>, data: Array<number>) {
            for (let i = 0; i < data.length; ++i) {
                target.push(data[i]);
            }
        }

        function parseAsTriangle(faces: Array<string>, forEachFace: (face: Array<string>) => void) {
            for (let i = 0; i < faces.length - 2; ++i) {
                let triangleFace = [faces[0], faces[i + 1], faces[i + 2]];
                forEachFace(triangleFace);
            }
        }

        function buildUpMeshes(content: string, unIndexedPositions: Array<Array<number>>,
            unIndexedUVs: Array<Array<number>>, unIndexedNormals: Array<Array<number>>)
            : Node {
            let container: Node = new Node();
            let objects = content.split(objectSplitPattern);
            objects.splice(0, 1);
            objects.forEach((objectContent) => {
                let geometry: Geometry = new Geometry();
                geometry.positions = [];
                geometry.normals = [];
                geometry.uvs = [];
                let faces = objectContent.match(indexPattern);
                faces == null ? null : faces.forEach((faceStr) => {
                    parseAsTriangle(faceStr.match(faceSplitVertPattern), (triangleFaces) => {
                        triangleFaces.forEach((perVertData) => {
                            let match = perVertData.match(facePerVertPattern);
                            if (match != null && match[1] != null) {
                                let positionIndex = parseInt(match[1]) - 1;
                                geometry.faces.push(geometry.positions.length / 3);
                                fillAVertex(geometry.positions, unIndexedPositions[positionIndex])
                                match[2] === '' ? null : fillAVertex(geometry.uvs, unIndexedUVs[parseInt(match[2]) - 1]);
                                match[3] === '' ? null : fillAVertex(geometry.normals, unIndexedNormals[parseInt(match[3]) - 1]);
                            }
                        })
                    })
                });
                let mesh = new Mesh(geometry, [new BRDFPerVertMaterial()]);
                container.addChild(mesh);
            });
            return container;
        }

        export function load(url: string, onload: (meshes: Node) => void) {
            fetch(url, (content: string) => {
                // remove comment
                content = content.replace(commentPattern, '');
                let positionlines: Array<string> = content.match(vertexPattern)
                let uvlines: Array<string> = content.match(uvPattern);
                let normallines: Array<string> = content.match(normalPattern);
                let unIndexedPositions = praiseAttibuteLines(positionlines);
                let unIndexedUVs = praiseAttibuteLines(uvlines);
                let unIndexedNormals = praiseAttibuteLines(normallines);
                let container = buildUpMeshes(content, unIndexedPositions, unIndexedUVs, unIndexedNormals);
                onload(container);
            });
        }
    }
}
