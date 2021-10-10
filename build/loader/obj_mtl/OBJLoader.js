import { Geometry } from "../../geometries/Geometry";
import { StandardMaterial } from "../../materials/surface/StandardMaterial";
import { Mesh } from "../../Mesh";
import { Object3d } from "../../Object3d";
import { mixin } from "../../Util";
import { fetchRes } from "../ResourceFetcher";
import { patterns } from "./CommonPatterns";
import { MTLLoader } from "./MTLLoader";
var OBJLoader = (function () {
    function OBJLoader() {
    }
    OBJLoader.load = function (gl, url) {
        var container = new Object3d();
        container.setAsyncFinished(fetchRes(url).then(function (content) {
            content = content.replace(patterns.commentPattern, "");
            var home = url.substr(0, url.lastIndexOf("/") + 1);
            var materialLibs = content.match(OBJLoader.mtlLibPattern);
            var materialsMixin = {};
            var promises = [];
            if (materialLibs != null) {
                for (var _i = 0, materialLibs_1 = materialLibs; _i < materialLibs_1.length; _i++) {
                    var mtlLib = materialLibs_1[_i];
                    var mtlurl = home + mtlLib.match(OBJLoader.mtlLibSinglePattern)[1];
                    promises.push(MTLLoader.load(gl, mtlurl));
                }
            }
            return Promise.all(promises).then(function (mtls) {
                for (var _i = 0, mtls_1 = mtls; _i < mtls_1.length; _i++) {
                    var materials = mtls_1[_i];
                    mixin(materialsMixin, materials);
                }
                var positionlines = content.match(OBJLoader.vertexPattern);
                var uvlines = content.match(OBJLoader.uvPattern);
                var normallines = content.match(OBJLoader.normalPattern);
                var unIndexedPositions = OBJLoader.praiseAttibuteLines(positionlines);
                var unIndexedUVs = OBJLoader.praiseAttibuteLines(uvlines);
                var unIndexedNormals = OBJLoader.praiseAttibuteLines(normallines);
                OBJLoader.buildUpMeshes(gl, container, content, materialsMixin, unIndexedPositions, unIndexedUVs, unIndexedNormals);
                return Promise.resolve(container);
            });
        }));
        return container;
    };
    OBJLoader.praiseAttibuteLines = function (lines) {
        var result = [];
        if (lines === null) {
            return;
        }
        lines.forEach(function (expression) {
            var data = [];
            expression.match(patterns.num).forEach(function (floatNum) {
                if (expression !== "") {
                    data.push(parseFloat(floatNum));
                }
            });
            result.push(data);
        });
        return result;
    };
    OBJLoader.parseAsTriangle = function (faces, forEachFace) {
        for (var i = 0; i < faces.length - 2; ++i) {
            var triangleFace = [faces[0], faces[i + 1], faces[i + 2]];
            forEachFace(triangleFace);
        }
    };
    OBJLoader.buildUpMeshes = function (gl, container, content, materials, unIndexedPositions, unIndexedUVs, unIndexedNormals) {
        var objects = content.split(OBJLoader.objectSplitPattern);
        objects.splice(0, 1);
        objects.forEach(function (objectContent) {
            var geometry = new Geometry(gl);
            var faces = objectContent.match(OBJLoader.indexPattern);
            if (faces !== null) {
                faces.forEach(function (faceStr) {
                    OBJLoader.parseAsTriangle(faceStr.match(OBJLoader.faceSplitVertPattern), function (triangleFaces) {
                        triangleFaces.forEach(function (perVertData) {
                            var match = perVertData.match(OBJLoader.facePerVertPattern);
                            console.assert(match !== null && match[1] !== null, "obj file error");
                            var positionIndex = parseInt(match[1], 0) - 1;
                            geometry.faces.data.push(geometry.attributes.position.data.length / 3);
                            geometry.addVertex({
                                position: unIndexedPositions[positionIndex],
                                aMainUV: [unIndexedUVs[parseInt(match[2], 0) - 1][0],
                                    unIndexedUVs[parseInt(match[2], 0) - 1][1]],
                                aNormal: unIndexedNormals[parseInt(match[3], 0) - 1],
                            });
                        });
                    });
                });
            }
            var meshMaterials = [];
            var mtls = objectContent.match(OBJLoader.useMTLPattern);
            if (!!mtls) {
                mtls.forEach(function (useMTLLine) {
                    meshMaterials.push(materials[useMTLLine.match(OBJLoader.useMTLSinglePattern)[1]]);
                });
            }
            else {
                meshMaterials.push(new StandardMaterial(gl));
            }
            var mesh = new Mesh(geometry, meshMaterials);
            mesh.setParent(container);
        });
    };
    OBJLoader.faceSplitVertPattern = /([0-9]|\/|\-)+/g;
    OBJLoader.facePerVertPattern = /([0-9]*)\/?([0-9]*)\/?([0-9]*)/;
    OBJLoader.objectSplitPattern = /[o|g]\s+.+/mg;
    OBJLoader.mtlLibPattern = /mtllib\s([^\s]+)/mg;
    OBJLoader.useMTLPattern = /usemtl\s([^\s]+)/mg;
    OBJLoader.mtlLibSinglePattern = /mtllib\s([^\s]+)/;
    OBJLoader.useMTLSinglePattern = /usemtl\s([^\s]+)/;
    OBJLoader.vertexPattern = /v\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)? ?)+/mg;
    OBJLoader.uvPattern = /vt\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)? ?)+/mg;
    OBJLoader.normalPattern = /vn\s+([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)? ?)+/mg;
    OBJLoader.indexPattern = /f\s+([-+]?[0-9]*\.?[0-9]+ ?|\/)+/mg;
    return OBJLoader;
}());
export { OBJLoader };
//# sourceMappingURL=OBJLoader.js.map