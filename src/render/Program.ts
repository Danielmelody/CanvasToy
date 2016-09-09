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
                this.uniforms[name] = this.getUniformLocation(this, name);
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

        addUniform(name: string, onUpdateUniform: (mesh: Mesh, camera: Camera) => void) {
            engine.gl.useProgram(this.webGlProgram);
            this.uniforms[name] = this.getUniformLocation(this, name);
            this.uniformUpdaters[name] = onUpdateUniform;
        }

        private getUniformLocation(program: Program, name: string): WebGLUniformLocation {
            if (engine.gl == undefined || engine.gl == null) {
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            var result = engine.gl.getUniformLocation(program.webGlProgram, name);
            if (result == null) {
                console.error("uniform " + name + " not found!");
                return null;
            }
            return result;
        }

        private getAttribLocation(program: Program, name: string): number {
            if (engine.gl == undefined || engine.gl == null) {
                console.error("WebGLRenderingContext has not been initialize!");
                return null;
            }
            var result = engine.gl.getAttribLocation(program.webGlProgram, name);
            if (result == null) {
                console.error("attribute " + name + " not found!");
                return null;
            }
            return result;
        }

    }
}
