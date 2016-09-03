/// <reference path="../CanvasToy.ts"/>

module CanvasToy {

    export interface ProgramParamter {
        uniforms: string[];
        attributes: VertexBuffer[];
    }

    export class Program {
        uniforms: {} = {};
        uniformUpdaters: {} = {};
        attributes: {} = {};
        webGlProgram: WebGLProgram;
        drawMode: number = engine.gl.STATIC_DRAW;
        textures: Array<Texture> = [];
        public indexBuffer: WebGLBuffer;
        public attribute0: VertexBuffer;
        public vertexBuffers = {};
        public material: Material;
        Program(parameter: ProgramParamter) {
            this.uniforms = parameter.uniforms;
            this.attributes = parameter.attributes;
            for (let name in parameter.uniforms) {
                this.uniforms[name] = engine.getUniformLocation(this, name);
            }
            for (let buffer of parameter.attributes) {
                buffer.index = engine.gl.getAttribLocation(this, buffer.name);
                this.vertexBuffers[buffer.name] = buffer;
            }
        }

        setAttribute0(newVertexBuffer: VertexBuffer): VertexBuffer {
            this.attribute0 = newVertexBuffer;
            this.attribute0.index = 0;
            this.vertexBuffers[newVertexBuffer.name] = newVertexBuffer;
            engine.gl.bindAttribLocation(this.webGlProgram, 0, this.attribute0.name);
            return newVertexBuffer;
        }

        addAttribute(newVertexBuffer: VertexBuffer): VertexBuffer {
            newVertexBuffer.index = engine.gl.getAttribLocation(this.webGlProgram, newVertexBuffer.name);
            this.vertexBuffers[newVertexBuffer.name] = newVertexBuffer;
            return newVertexBuffer;
        }

        addUniform(name: string, onUpdateUniform: () => void) {
            engine.gl.useProgram(this.webGlProgram);
            this.uniforms[name] = engine.getUniformLocation(this, name);
            this.uniformUpdaters[name] = onUpdateUniform;
        }

        addTexture(sampler: string, texture: Texture) {
            this.textures.push(texture);
            let lastOnload = texture.image.onload;
            console.log('addTexture');
            texture.image.onload = (et: Event) => {
                lastOnload.apply(texture.image, et);
                let gl = engine.gl;
                gl.useProgram(this.webGlProgram);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
                gl.activeTexture(gl.TEXTURE0 + texture.unit);
                gl.bindTexture(texture.type, texture.glTexture);
                texture.setUpTextureData();
                gl.texParameteri(texture.type, gl.TEXTURE_WRAP_S, texture.wrapS);
                gl.texParameteri(texture.type, gl.TEXTURE_WRAP_T, texture.wrapT);
                gl.texParameteri(texture.type, gl.TEXTURE_MAG_FILTER, texture.magFilter);
                gl.texParameteri(texture.type, gl.TEXTURE_MIN_FILTER, texture.minFilter);
                console.log('test');
                // the sampler
                this.addUniform(sampler, () => {
                    engine.gl.uniform1i(
                        this.uniforms[sampler],
                        texture.unit);
                })
            }
        }

    }
}
