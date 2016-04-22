/// <reference path="./geometries/Geometry.ts"/>
/// <reference path="./materials/Material.ts"/>
/// <reference path="./Node.ts"/>

module CanvasToy{

    export class Mesh extends Node{

        protected indexBuffer:WebGLBuffer;
        protected vertexBuffers = {};

        protected geometry:Geometry;
        protected material:Material


        constructor(geometry:Geometry, material:Material) {
            super();
            this.material = material;
            this.geometry = geometry;
            engine.makeProgram(geometry, material, {precision:'mediump'});
            this.initUniforms();
            this.initVerticesData();
            this.updateVerticesData();
        }

        initVerticesData() {
            let gl = engine.gl;
            this.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.geometry.indices), gl.STATIC_DRAW);
            this.addAttribute(new VertexBuffer("position", 3, gl.FLOAT))
            .data = this.geometry.positions;
            this.addAttribute(new VertexBuffer("aTextureCoord", 2, gl.FLOAT))
            .data = this.geometry.uvs;
            /*this.addAttribute(new VertexBuffer("aNormal", 3, gl.FLOAT))
            .data = this.geometry.normals;*/

        }

        initUniforms() {
            this.mvUniform = engine.getUniformLocation("modelViewMatrix");
            this.pMUniform = engine.getUniformLocation("projectionMatrix");
        }

        addAttribute(newVertexBuffer:VertexBuffer):VertexBuffer {
            newVertexBuffer.index = engine.gl.getAttribLocation(engine.currentProgram, newVertexBuffer.name);
            this.vertexBuffers[newVertexBuffer.name] = newVertexBuffer;
            return newVertexBuffer;
        }

        updateVerticesData() {
            let gl = engine.gl;
            for (let name in this.vertexBuffers) {
                console.log(name);
                gl.enableVertexAttribArray(this.vertexBuffers[name].index);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffers[name].buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexBuffers[name].data), engine.gl.STATIC_DRAW);
            }
        };

        draw(camera:Camera){
            super.draw(camera);
            let gl = engine.gl;
            for (let name in this.vertexBuffers) {
                gl.bindBuffer(engine.gl.ARRAY_BUFFER, this.vertexBuffers[name].buffer);
                engine.gl.vertexAttribPointer(
                    this.vertexBuffers[name].index,
                    this.vertexBuffers[name].size,
                    this.vertexBuffers[name].type ,
                    false,
                    0,
                    0);
            }
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            //console.log("index num:" + this.geometry.indices.length);
            gl.drawElements(gl.TRIANGLES, this.geometry.indices.length, gl.UNSIGNED_SHORT, 0);
        }
    }
}
