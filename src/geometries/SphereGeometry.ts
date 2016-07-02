/// <reference path="./Geometry.ts"/>

module CanvasToy {
    export class SphereGeometry extends Geometry {
        constructor(public radius: number, public perVertDistance: number) {
            super();
            for (let y = - radius; y <= radius; y += perVertDistance) {
                let circlrRadius = Math.sqrt(radius * radius - y * y);
                for (let x = -circlrRadius; x <= circlrRadius; x += perVertDistance) {
                    let z1 = Math.sqrt(circlrRadius * circlrRadius - x * x);
                    let z2 = -z1;
                    this.positions.push(x, y, z1);
                    this.positions.push(x, y, z2);
                }
            }
            for (let verts of this.positions) {
                console.log(verts);
            }
        }
    }
}
