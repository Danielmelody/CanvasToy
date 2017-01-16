/// <reference path="./Geometry.ts"/>

namespace CanvasToy {

    class SphereGeometry extends Geometry {
        public radius: number;
        public perVertDistance: number;
        constructor(gl: WebGLRenderingContext, radius: number, perVertDistance: number) {
            super(gl);
            for (let y = - radius; y <= radius; y += perVertDistance) {
                const circlrRadius = Math.sqrt(radius * radius - y * y);
                for (let x = -circlrRadius; x <= circlrRadius; x += perVertDistance) {
                    const z1 = Math.sqrt(circlrRadius * circlrRadius - x * x);
                    const z2 = -z1;
                    this.attributes.position.data.push(x, y, z1);
                    this.attributes.position.data.push(x, y, z2);
                }
            }
            // TODO: generate faces
        }
    }
}
