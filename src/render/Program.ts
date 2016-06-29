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
        public indexBuffer: WebGLBuffer;
        public attribute0: VertexBuffer;
        public vertexBuffers = {};
        Program(parameter: ProgramParamter) {
            this.uniforms = parameter.uniforms;
            this.attributes = parameter.attributes;
            for (let name in parameter.uniforms) {
                this.uniforms[name] = engine.getUniformLocation(this, name);
            }
            for (let buffer of parameter.attributes) {
                buffer.index = engine.gl.getAttribLocation(this, name);
                this.vertexBuffers[name] = buffer;
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
    }
}
