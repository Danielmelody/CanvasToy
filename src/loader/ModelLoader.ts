/// <reference path="../geometries/Geometry.ts"/>
/// <reference path="../materials/Material.ts"/>
module CanvasToy {
    export class ModelLoader {

        private static fetch(url: string, onload: (content: string) => void) {
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

        private static praiseObject() {

        }

        public static loadObj(url: string, onload: (meshes:Node) => void) {
            var numberRegular = /([0-9]|\s|\.|\-|)+/g;
            var objectSplitRegular = /o\s.+/g, m;
            var materialRegular = /usemtl\s.+/;
            var vertexRegular = /v\s([0-9]|\s|\.|\-|)+/g, m;
            var uvRegular = /vt\s([0-9]|\s|\.|\-|)+/g, m;
            var normalRegular = /vn\s([0-9]|\s|\.|\-|)+/g, m;
            var indexRegular = /f.+/, m;
            var praise = (expressions, geometry, targetArray: string) => {
                expressions.forEach((positionExpression: string) => {
                    var data = positionExpression.match(numberRegular).map(
                        (expression) => parseFloat(expression)
                    );
                    geometry[targetArray] = geometry[targetArray].concat(data);
                });
            }
            ModelLoader.fetch(url, (content: string) => {
                var meshes = new Node();
                var sparation = content.match(objectSplitRegular);
                var geometryContents = content.split(objectSplitRegular);
                for (let i = 0; i < geometryContents.length; ++i) {
                    var geometry = new Geometry();
                    let positionExpressions: Array<string> = content.match(vertexRegular)
                    let uvExpressions: Array<string> = content.match(uvRegular);
                    let normalExpressions: Array<string> = content.match(normalRegular);
                    let indicesExpressions: Array<string> = content.match(indexRegular);
                    praise(positionExpressions, geometry, 'positions');
                    praise(uvExpressions, geometry, 'uvs');
                    praise(normalExpressions, geometry, "normals");
                    praise(indicesExpressions, geometry, 'indices');
                    // TODO: praise mtl file
                    var mesh = new Mesh(geometry, new BRDFPerFragMaterial());
                    meshes.addChild(mesh);
                }
                onload(meshes);
            });
        }

    }
}
