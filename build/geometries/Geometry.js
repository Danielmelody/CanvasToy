import { DataType } from "../DataTypeEnum";
import { Graphics } from "../renderer/GraphicsUtils";
import { Attribute } from "../shader/Attibute";
var Faces = (function () {
    function Faces(gl, data) {
        this.data = [];
        this.data = data;
        this.buffer = gl.createBuffer();
    }
    return Faces;
}());
export { Faces };
var Geometry = (function () {
    function Geometry(gl) {
        this._dirty = true;
        this.gl = gl;
        this.attributes = {
            position: new Attribute(gl, {
                type: DataType.float,
                size: 3,
                data: [],
            }),
            aMainUV: new Attribute(gl, {
                type: DataType.float,
                size: 2,
                data: [],
            }),
            aNormal: new Attribute(gl, {
                type: DataType.float,
                size: 3,
                data: [],
            }),
            flatNormal: new Attribute(gl, {
                type: DataType.float,
                size: 3,
                data: [],
            }),
        };
        this.faces = { data: [], buffer: gl.createBuffer() };
    }
    Geometry.prototype.build = function () {
        return this;
    };
    Geometry.prototype.assertValid = function () {
        var maxIndex = 0;
        for (var _i = 0, _a = this.faces.data; _i < _a.length; _i++) {
            var index = _a[_i];
            maxIndex = Math.max(maxIndex, index);
        }
        for (var attributeName in this.attributes) {
            console.assert(this.attributes[attributeName].size <= 4 &&
                this.attributes[attributeName].size >= 1, attributeName +
                "size error, now: " +
                this.attributes[attributeName].size +
                " should be 1-4");
            console.assert((maxIndex + 1) * this.attributes[attributeName].stride <=
                this.attributes[attributeName].data.length, attributeName +
                " length error, now:" +
                this.attributes[attributeName].data.length +
                ", should bigger than:" +
                (maxIndex + 1) * this.attributes[attributeName].stride);
        }
        return this;
    };
    Geometry.prototype.setAttribute = function (name, attribute) {
        this.attributes[name] = attribute;
        return this;
    };
    Geometry.prototype.addVertex = function (vertex) {
        for (var attributeName in this.attributes) {
            if (this.attributes[attributeName] !== undefined) {
                if (vertex[attributeName] === undefined) {
                    continue;
                }
                if (vertex[attributeName].length !==
                    this.attributes[attributeName].size) {
                    console.error("length " + attributeName + "wrong");
                    continue;
                }
                for (var _i = 0, _a = vertex[attributeName]; _i < _a.length; _i++) {
                    var comp = _a[_i];
                    this.attributes[attributeName].data.push(comp);
                }
            }
        }
        return this;
    };
    Geometry.prototype.removeAttribute = function (name) {
        this.attributes[name] = undefined;
        return this;
    };
    Geometry.prototype.getVertexByIndex = function (index) {
        var vertex = {};
        for (var attributeName in this.attributes) {
            vertex[attributeName] = [];
            for (var i = 0; i < this.attributes[attributeName].stride; ++i) {
                vertex[attributeName].push(this.attributes[attributeName].data[this.attributes[attributeName].stride * index + i]);
            }
        }
        return vertex;
    };
    Geometry.prototype.getTriangleByIndex = function (triangleIndex) {
        return [
            this.getVertexByIndex(triangleIndex * 3),
            this.getVertexByIndex(triangleIndex * 3 + 1),
            this.getVertexByIndex(triangleIndex * 3 + 2),
        ];
    };
    Geometry.prototype.generateFlatNormal = function () {
        for (var i = 0; i < this.faces.data.length; i += 3) {
            var triangle = this.getTriangleByIndex(i / 3);
            var flatX = (triangle[0].normals[0] +
                triangle[0].normals[1] +
                triangle[0].normals[2]) /
                3;
            var flatY = (triangle[1].normals[0] +
                triangle[1].normals[1] +
                triangle[1].normals[2]) /
                3;
            var flatZ = (triangle[2].normals[0] +
                triangle[0].normals[1] +
                triangle[2].normals[2]) /
                3;
            var flat = [
                flatX,
                flatY,
                flatZ,
                flatX,
                flatY,
                flatZ,
                flatX,
                flatY,
                flatZ,
            ];
            this.attributes.flatNormal.data = this.attributes.flatNormal.data.concat(flat);
        }
        return this;
    };
    Geometry.prototype.resetLightShadows = function (gl) {
        if (this._dirty) {
            Graphics.copyDataToVertexBuffer(gl, this);
        }
        this._dirty = false;
    };
    return Geometry;
}());
export { Geometry };
//# sourceMappingURL=Geometry.js.map