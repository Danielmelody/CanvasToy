/// <reference path="../CanvasToy.ts"/>

module CanvasToy {

    export interface ProgramParamter{
        uniforms:string[];
        attributes:VertexBuffer[];
    }

    export class Program{
        uniforms:{} = {};
        attributes:{} = {};
        webGlProgram:WebGLProgram;
        drawMode:number = engine.gl.STATIC_DRAW;
        public indexBuffer:WebGLBuffer;
        public vertexBuffers = {};
        Program(parameter:ProgramParamter) {
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

        addAttribute(newVertexBuffer:VertexBuffer):VertexBuffer {
            newVertexBuffer.index = engine.gl.getAttribLocation(this.webGlProgram, newVertexBuffer.name);
            this.vertexBuffers[newVertexBuffer.name] = newVertexBuffer;
            return newVertexBuffer;
        }

        addUniform(name:string) {
            this.uniforms[name] = engine.getUniformLocation(this, name);
        }

    }
}
