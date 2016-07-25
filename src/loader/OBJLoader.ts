/// <reference path="../geometries/Geometry.ts"/>
/// <reference path="../materials/Material.ts"/>
module CanvasToy {
    export module OBJLoader {

        var commentRegular = /\#.*/mg;
        var numberRegular = /([0-9]|\.|\-|e)+/g;
        var objectSplitRegular = /[o|g]\s+.+/mg;
        var materialRegular = /usemtl\s.+/;
        var vertexRegular = /v\s+([0-9]|\s|\.|\-|e)+/mg;
        var uvRegular = /vt\s+([0-9]|\s|\.|\-|e)+/mg;
        var normalRegular = /vn\s+([0-9]|\s|\.|\-|e)+/mg;
        var indexRegular = /f\s+([0-9]|\s|\/|\-|)+/mg;

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
                console.log(lines);
                if (lines == null) {
                    return;
                }
                lines.forEach((expression: string) => {
                    let data:Array<number> = [];
                    if (expression.match(numberRegular) == null) {
                        console.log(expression);
                    }
                    expression.match(numberRegular).forEach(
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

        function fillAVertex(target:Array<number>, vertIndex:number, data:Array<number>) {
            for(let i = 0; i < data.length; ++i) {
                target[vertIndex * data.length +i] = data[i];
            }
        }

        export function load(url: string, onload: (meshes: Node) => void) {
            fetch(url, (content: string) => {
                // remove comment
                content = content.replace(commentRegular, '');
                console.log(content);
                var meshes = new Node();
                var sparation = content.match(objectSplitRegular);
                var geometryContents = content.split(objectSplitRegular);
                for (let i = 1; i < geometryContents.length; ++i) {
                    // console.log(geometryContents[i]);
                    var geometry = new Geometry();
                    let positionlines: Array<string> = geometryContents[i].match(vertexRegular)
                    let uvlines: Array<string> = geometryContents[i].match(uvRegular);
                    let normallines: Array<string> = geometryContents[i].match(normalRegular);
                    let indicesExpression: Array<string> = geometryContents[i].match(indexRegular);
                    let unIndexedPositions = praiseAttibuteLines(positionlines);
                    let unIndexedUVs = praiseAttibuteLines(uvlines);
                    let unIndexedNormals = praiseAttibuteLines(normallines);
                    if (indicesExpression != null) {
                        geometry.positions = [];
                        geometry.normals = new Array(unIndexedPositions.length);
                        geometry.normals = new Array(unIndexedPositions.length);

                        unIndexedPositions.forEach((poss:Array<number>) => {
                            geometry.positions = geometry.positions.concat(poss);
                        })

                        indicesExpression.forEach((expression) => {
                            let indicesStr: Array<string> = expression.match(/([0-9]|\/|\-|)+/g);
                            indicesStr.forEach((vertexData) => {
                                if (vertexData != '') {
                                    var match = vertexData.match(/([0-9]+)\/([0-9]+)\/([0-9]+)/);
                                    if (match != null && match[1] != null) {
                                        let positionIndex = parseInt(match[1]) - 1;
                                        geometry.indices.push(positionIndex);
                                        match[2] === '' ? null : fillAVertex(geometry.uvs, positionIndex, unIndexedUVs[parseInt(match[2]) - 1]);
                                        match[3] === '' ? null : fillAVertex(geometry.normals, positionIndex, unIndexedNormals[parseInt(match[3]) - 1]);
                                    }
                                }
                            })
                        });
                    }
                    // TODO: parse mtl file
                    var mesh = new Mesh(geometry, new BRDFPerFragMaterial());
                    console.log(mesh);
                    meshes.addChild(mesh);
                }
                onload(meshes);
            });
        }

    }
}
