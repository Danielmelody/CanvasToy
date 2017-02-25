/// <reference path="./Light.ts"/>
namespace CanvasToy {
    export class PointLight extends Light {

        @uniform("position", DataType.vec3, (light, camera) => {
            return vec3.transformMat4(vec3.create(), light.position,
                mat4.mul(mat4.create(), camera.worldToObjectMatrix, light.matrix),
            );
        })
        protected _position: Vec3Array = vec3.create();

        @uniform("radius", DataType.float)
        protected _radius: number = 100;

        constructor(gl: WebGLRenderingContext) {
            super();
            this.volume = new SphereGeometry(gl).setRadius(this._radius).build();
            this._projectCamera = new PerspectiveCamera();
        }

        public getProjecttionBoundingBox(camera: Camera): BoundingBox {
            const mvpMatrix = mat4.multiply(
                mat4.create(),
                camera.projectionMatrix,
                mat4.multiply(mat4.create(),
                    camera.worldToObjectMatrix,
                    this.matrix),
            );
            let upSide = vec3.normalize(vec3.create(), camera.upVector);
            vec3.scale(upSide, upSide, this.radius);
            upSide = vec3.transformMat4(vec3.create(), upSide, mvpMatrix);
            const screenLength = vec3.len(upSide);
            const screenPos = vec3.transformMat4(vec3.create(), this._position, mvpMatrix);
            return {
                left: screenPos[0] - screenLength,
                right: screenPos[0] + screenLength,
                top: screenPos[1] + screenLength,
                bottom: screenPos[1] - screenLength,
            };
        }

        public setRadius(radius: number) {
            this._radius = radius;
            (this.volume as SphereGeometry).setRadius(this._radius).build();
            return this;
        }

        public get radius() {
            return this._radius;
        }
    }
}
