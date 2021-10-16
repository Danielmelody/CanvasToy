import { mat4 } from "gl-matrix";
import { DataType } from "../DataTypeEnum";
import { Graphics } from "../renderer/GraphicsUtils";
var Program = (function () {
    function Program(gl, source, holders) {
        this.enableDepthTest = true;
        this.enableStencilTest = true;
        this.dirty = true;
        this.extensionStatements = [];
        this.defineCaches = {};
        this.uniformCaches = {};
        this.uniformArrayCaches = {};
        this.undesiredUniforms = {};
        this.attributeLocations = {};
        this.undesiredAttributes = {};
        this.paramFilters = {};
        this.vertexPrecision = "highp";
        this.fragmentPrecision = "highp";
        this.drawMode = function (gl) { return gl.STATIC_DRAW; };
        this.gl = gl;
        this.source = source;
        this.extraRenderParamHolders = holders;
        this.viewport = {
            x: 0,
            y: 0,
            width: gl.canvas.width,
            height: gl.canvas.height,
        };
    }
    Program.prototype.setFragmentShader = function (fragmentShader) {
        this.source.fragmentShader = fragmentShader;
        return this;
    };
    Program.prototype.setVertexShader = function (vertexShader) {
        this.source.vertexShader = vertexShader;
        return this;
    };
    Program.prototype.setExtraRenderParam = function (name, paramHolder) {
        this.extraRenderParamHolders[name] = paramHolder;
        return this;
    };
    Program.prototype.setViewPort = function (viewport) {
        this.viewport = viewport;
    };
    Program.prototype.resetLightShadows = function () {
        if (this.dirty) {
            this.make();
            this.dirty = false;
        }
    };
    Program.prototype.make = function () {
        var defines = [];
        for (var defineName in this.defineCaches) {
            var defineVal = this.defineCaches[defineName] || "";
            var defineLine = "#define " + defineName + " " + defineVal;
            defines.push(defineLine);
            console.log(defineLine);
        }
        this.webGlProgram = Graphics.createEntileShader(this.gl, this.extensionStatements.join("\n") +
            "\n precision " +
            this.vertexPrecision +
            " float;\n" +
            defines.join("\n") +
            "\n" +
            this.source.vertexShader, this.extensionStatements.join("\n") +
            "\n precision " +
            this.fragmentPrecision +
            " float;\n" +
            defines.join("\n") +
            "\n" +
            this.source.fragmentShader);
        this.undesiredUniforms = {};
        this.uniformCaches = {};
        this.undesiredAttributes = {};
        this.attributeLocations = {};
        return this;
    };
    Program.prototype.pass = function (buildinContainers) {
        this.updateDefines(buildinContainers);
        this.resetLightShadows();
        var currentTextureUnit = [0];
        this.gl.useProgram(this.webGlProgram);
        this.gl.viewport(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);
        for (var holderName in buildinContainers) {
            var holder = Graphics.getRenderParamHost(buildinContainers[holderName]);
            this.passOneParamsHolder(buildinContainers, holder, currentTextureUnit);
        }
        for (var holderName in this.extraRenderParamHolders) {
            var holder = this.extraRenderParamHolders[holderName];
            this.passOneParamsHolder(buildinContainers, holder, currentTextureUnit);
        }
        var geometry = buildinContainers.mesh.geometry;
        for (var attributeKey in geometry.attributes) {
            if (attributeKey in this.undesiredAttributes) {
                continue;
            }
            var attribute = geometry.attributes[attributeKey];
            var location_1 = this.attributeLocations[attributeKey];
            if (location_1 === undefined) {
                location_1 = this.getAttribLocation(attributeKey);
                if (location_1 === null || location_1 === -1) {
                    this.undesiredAttributes[attributeKey] = undefined;
                    continue;
                }
                this.attributeLocations[attributeKey] = location_1;
            }
            this.gl.enableVertexAttribArray(this.attributeLocations[attributeKey]);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attribute.buffer);
            this.gl.vertexAttribPointer(this.attributeLocations[attributeKey], attribute.size, attribute.type, false, 0, 0);
        }
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, geometry.faces.buffer);
        this.gl.drawElements(this.gl.TRIANGLES, geometry.faces.data.length, this.gl.UNSIGNED_SHORT, 0);
        for (var attributeKey in this.attributeLocations) {
            var attribute = geometry.attributes[attributeKey];
            this.gl.disableVertexAttribArray(this.attributeLocations[attributeKey]);
        }
        return this;
    };
    Program.prototype.passOneParamsHolder = function (buildinContainder, holder, texIndex, namePrefix) {
        if (namePrefix === void 0) { namePrefix = ""; }
        if (holder === undefined) {
            return;
        }
        if (!!holder.customPrefix) {
            namePrefix = holder.customPrefix;
        }
        for (var linkName in holder.paramFilters) {
            this.paramFilters[namePrefix + linkName] =
                holder.paramFilters[linkName];
        }
        for (var uniformKey in holder.uniforms) {
            var uniformInfo = holder.uniforms[uniformKey];
            var uniformName = namePrefix + (uniformInfo.name || uniformKey);
            if (!this.filter(name)) {
                continue;
            }
            var val = !!uniformInfo.updator
                ? uniformInfo.updator(buildinContainder)
                : holder.hostObject[uniformKey];
            this.updateUniform(uniformName, uniformInfo.type, val);
        }
        for (var uniformArrayKey in holder.uniformArrays) {
            var uniformArrayInfo = holder.uniforms[uniformArrayKey];
            var uniformArrayName = namePrefix + (uniformArrayInfo.name || uniformArrayKey);
            if (!this.filter(name)) {
                continue;
            }
            var val = !!uniformArrayInfo.updator
                ? uniformArrayInfo.updator(buildinContainder)
                : holder.hostObject[uniformArrayKey];
            this.updateUniformArray(uniformArrayName, uniformArrayInfo.type, val);
        }
        for (var textureKey in holder.textures) {
            var textureInfo = holder.textures[textureKey];
            var name_1 = namePrefix + (textureInfo.name || textureKey);
            if (!this.filter(name_1)) {
                continue;
            }
            var texture = !!textureInfo.source
                ? textureInfo.source
                : holder.hostObject[textureKey];
            if (!!texture) {
                this.gl.activeTexture(this.gl.TEXTURE0 + texIndex[0]);
                this.gl.bindTexture(texture.target, texture.glTexture);
                this.updateUniform(name_1, BaseType.i32, texIndex[0]);
                texIndex[0]++;
            }
        }
        for (var textureArrayKey in holder.textureArrays) {
            var textureArrayInfo = holder.textureArrays[textureArrayKey];
            var name_2 = namePrefix + (textureArrayInfo.name || textureArrayKey);
            if (!this.filter(name_2)) {
                continue;
            }
            var textureArray = !!textureArrayInfo.sources
                ? textureArrayInfo.sources
                : holder.hostObject[textureArrayKey];
            var indices = [];
            for (var _i = 0, textureArray_1 = textureArray; _i < textureArray_1.length; _i++) {
                var texture = textureArray_1[_i];
                this.gl.activeTexture(this.gl.TEXTURE0 + texIndex[0]);
                this.gl.bindTexture(texture.target, texture.glTexture);
                indices.push(texIndex[0]);
                texIndex[0]++;
            }
            if (indices.length > 0) {
                this.updateUniformArray(name_2, BaseType.i32, new Int32Array(indices));
            }
        }
        if (!!holder.structArrays && namePrefix !== "" && !!holder.hostObject) {
            throw new Error("structArray can only be nested of depth 1");
        }
        for (var structArrayKey in holder.structArrays) {
            var structArrayInfo = holder.structArrays[structArrayKey];
            var arrayName = structArrayInfo.name || structArrayKey;
            var structArray = holder.hostObject[structArrayKey];
            for (var i in structArray) {
                var struct = structArray[i];
                var paramHolder = Graphics.getRenderParamHost(struct);
                if (paramHolder === undefined) {
                    throw new Error("\n                    Property " + arrayName + " of type " + typeof holder.hostObject + "\n                    must be an array of class annotated by @RenderParamContainer");
                }
                this.passOneParamsHolder(buildinContainder, Graphics.getRenderParamHost(struct), texIndex, arrayName + "[" + i + "].");
            }
        }
    };
    Program.prototype.filter = function (name) {
        if (name in this.paramFilters &&
            !(this.paramFilters[name].name in this.defineCaches)) {
            var value = this.defineCaches[this.paramFilters[name].name];
            return this.paramFilters[name].filter(value);
        }
        return true;
    };
    Program.prototype.updateDefines = function (buildinContainers) {
        for (var holderName in buildinContainers) {
            this.updateOneDefines(Graphics.getRenderParamHost(buildinContainers[holderName]), buildinContainers);
        }
        for (var holderName in this.extraRenderParamHolders) {
            this.updateOneDefines(this.extraRenderParamHolders[holderName], buildinContainers);
        }
    };
    Program.prototype.updateOneDefines = function (holder, buildinContainers) {
        if (!!holder) {
            for (var defineKey in holder.defines) {
                var defineName = holder.defines[defineKey].defineName;
                var val = "";
                if (!!holder.hostObject) {
                    if (!holder.hostObject[defineKey]) {
                        continue;
                    }
                    val = holder.hostObject[defineKey];
                }
                else if (!!holder.defines[defineKey].value) {
                    val = holder.defines[defineKey].value;
                }
                var cache = this.defineCaches[defineName];
                this.defineCaches[defineName] = val;
                if (val !== cache) {
                    this.dirty = true;
                }
            }
            for (var structArrayKey in holder.structArrays) {
                var structArrayInfo = holder.structArrays[structArrayKey];
                var arrayName = structArrayInfo.name || structArrayKey;
                var structArray = holder.hostObject[structArrayKey];
                var val = structArray.length.toString();
                var cache = this.defineCaches[arrayName + "Num"];
                if (val !== cache) {
                    this.dirty = true;
                }
                this.defineCaches[arrayName + "Num"] = val;
            }
        }
    };
    Program.prototype.updateUniform = function (name, type, value) {
        if (value === undefined) {
            return;
        }
        if (name in this.undesiredUniforms) {
            return;
        }
        var cache = this.uniformCaches[name];
        if (!cache) {
            cache = {
                value: value,
                location: this.gl.getUniformLocation(this.webGlProgram, name),
            };
            if (cache.location === null) {
                this.undesiredUniforms[name] = undefined;
                return;
            }
            console.log("initial pass uniform " + name + " " + value);
            this.uniformCaches[name] = cache;
        }
        var location = cache.location;
        if (!location) {
            console.error(location);
        }
        switch (type) {
            case DataType.float:
                this.gl.uniform1f(location, value);
                break;
            case BaseType.i32:
                this.gl.uniform1i(location, value);
                break;
            case DataType.vec2:
                this.gl.uniform2f(location, value[0], value[1]);
                break;
            case DataType.vec3:
                this.gl.uniform3f(location, value[0], value[1], value[2]);
                break;
            case DataType.vec4:
                this.gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                break;
            case DataType.mat2:
                this.gl.uniformMatrix2fv(location, false, value);
            case DataType.mat3:
                this.gl.uniformMatrix3fv(location, false, value);
            case DataType.mat4:
                this.gl.uniformMatrix4fv(location, false, value);
                break;
            default:
                break;
        }
    };
    Program.prototype.updateUniformArray = function (name, type, value) {
        if (value === undefined) {
            return;
        }
        if (name in this.undesiredUniforms) {
            return;
        }
        var cache = this.uniformArrayCaches[name];
        if (!cache) {
            cache = {
                value: value,
                location: this.gl.getUniformLocation(this.webGlProgram, name),
            };
            if (cache.location === null) {
                this.undesiredUniforms[name] = undefined;
                return;
            }
            console.log("initial pass uniform array " + name + " " + value);
            this.uniformArrayCaches[name] = cache;
        }
        var location = cache.location;
        switch (type) {
            case DataType.float:
                this.gl.uniform1fv(location, value);
                break;
            case BaseType.i32:
                this.gl.uniform1iv(location, value);
                break;
            case DataType.vec2:
                this.gl.uniform2fv(location, value);
                break;
            case DataType.vec3:
                this.gl.uniform3fv(location, value);
                break;
            case DataType.vec4:
                this.gl.uniform4fv(location, value);
                break;
            case DataType.mat2:
                this.gl.uniformMatrix2fv(location, false, value);
            case DataType.mat3:
                this.gl.uniformMatrix3fv(location, false, value);
            case DataType.mat4:
                this.gl.uniformMatrix4fv(location, false, value);
                break;
            default:
                break;
        }
        return this;
    };
    Program.prototype.getAttribLocation = function (name) {
        if (this.gl === undefined || this.gl === null) {
            console.error("WebGLRenderingContext has not been initialize!");
            return null;
        }
        var result = this.gl.getAttribLocation(this.webGlProgram, name);
        if (result === null) {
            console.error("attribute " + name + " not found!");
            return null;
        }
        console.log("initial pass attribute " + name + " " + result);
        return result;
    };
    return Program;
}());
export { Program };
export var shaderPassLib = {
    uniforms: {
        modelViewProjectionMatrix: {
            type: DataType.mat4,
            updator: function (p) {
                return mat4.multiply(mat4.create(), p.camera.projectionMatrix, mat4.multiply(mat4.create(), p.camera.worldToObjectMatrix, p.mesh.matrix));
            },
        },
        modelViewMatrix: {
            type: DataType.mat4,
            updator: function (_a) {
                var mesh = _a.mesh, camera = _a.camera;
                return mat4.mul(mat4.create(), camera.worldToObjectMatrix, mesh.matrix);
            },
        },
        normalViewMatrix: {
            type: DataType.mat4,
            updator: function (_a) {
                var mesh = _a.mesh, camera = _a.camera;
                return mat4.transpose(mat4.create(), mat4.invert(mat4.create(), mat4.mul(mat4.create(), camera.worldToObjectMatrix, mesh.matrix)));
            },
        },
    },
    defines: {
        filterSize: { defineName: "FILTER_SIZE", value: "6" },
        blockSize: { defineName: "BLOCK_SIZE", value: "6" },
    },
};
//# sourceMappingURL=Program.js.map