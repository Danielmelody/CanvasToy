import { mat4, vec3 } from "gl-matrix";
import { Camera } from "../cameras/Camera";

import { SphereGeometry } from "../geometries/SphereGeometry";
import { BoundingBox2D } from "../Intersections/BoundingBox";

import { Renderer } from "../renderer/Renderer";

import { ProcessingFrameBuffer } from "../renderer/SwapFramebuffer";
import { IBuildinRenderParamMaps } from "../shader/Program";
import { CubeTexture } from "../textures/CubeTexture";
import { DampingLight } from "./DampingLight";

import { ShadowLevel } from "./ShadowLevel";
import { SpotLight } from "./SpotLight";

export class PointLight extends DampingLight {
    private _spotLights: SpotLight[];

    private _cubeTexture: CubeTexture;

    constructor(renderer: Renderer) {
        super(renderer);
    }

    public get shadowMap() {
        return this._cubeTexture;
    }

    public get shadowFrameBuffers(): ProcessingFrameBuffer[] {
        return this._spotLights.map(spot => spot.shadowFrameBuffer);
    }

    public get projectionMatrix() {
        return this._spotLights[0].projectionMatrix;
    }

    public get far() {
        return this._spotLights[0].far;
    }

    public get near() {
        return this._spotLights[0].near;
    }

    public getDeferredInfo(layer: number, renderCamera: Camera) {
        switch (layer) {
            case 0:
                return super.getDeferredInfo(layer, renderCamera);
            case 1:
                const viewPos = vec3.transformMat4(
                    vec3.create(),
                    this._position,
                    renderCamera.worldToObjectMatrix
                );
                return [viewPos[0], viewPos[1], viewPos[2], this._radius];
            case 2:
                return [
                    this.squareAttenuation,
                    this.linearAttenuation,
                    this.constantAttenuation
                ];
            default:
                throw Error("deferred Info " + layer + " undifined");
        }
    }

    public setColor(color: vec3) {
        this._color = color;
        for (const spotLight of this._spotLights) {
            spotLight.setColor(color);
        }
        return this;
    }

    public setIdensity(idensity: number) {
        this._idensity = idensity;
        for (const spotLight of this._spotLights) {
            spotLight.setIdensity(idensity);
        }
        return this;
    }

    public setShadowLevel(shadowLevel: ShadowLevel) {
        this._shadowLevel = shadowLevel;
        for (const spotLight of this._spotLights) {
            spotLight.setShadowLevel(shadowLevel);
        }
        return this;
    }

    public setShadowSize(shadowSize: number) {
        this._shadowSize = shadowSize;
        for (const spotLight of this._spotLights) {
            spotLight.setShadowSize(shadowSize);
        }
        return this;
    }

    public setShadowSoftness(_shadowSoftness: number) {
        this._shadowSoftness = _shadowSoftness;
        for (const spotLight of this._spotLights) {
            spotLight.setShadowSoftness(_shadowSoftness);
        }
        return this;
    }

    public setPCSSArea(_pcssArea: number) {
        this._pcssArea = _pcssArea;
        for (const spotLight of this._spotLights) {
            spotLight.setPCSSArea(_pcssArea);
        }
        return this;
    }

    public setRadius(radius: number) {
        this._radius = radius;
        (this.volume as SphereGeometry).setRadius(this._radius).build();
        for (const spotLight of this._spotLights) {
            spotLight.setRadius(radius);
        }
        return this;
    }

    public init(renderer) {
        this._shadowLevel = ShadowLevel.Hard;
        this._cubeTexture = new CubeTexture(renderer.gl)
            .setFormat(this.gl.RGBA)
            .setType(this.gl.FLOAT);
        this._spotLights = [0, 0, 0, 0, 0, 0].map(
            () => new SpotLight(renderer)
        );
        this.volume = new SphereGeometry(this.gl)
            .setRadius(this._radius)
            .build();
        for (let i = 0; i < this._spotLights.length; ++i) {
            const spotLight = this._spotLights[i];
            spotLight.init(renderer).setConeAngle(Math.PI / 4);
            spotLight.shadowFrameBuffer.onInit(fbo => {
                fbo.attachments.color.asTargetTexture(
                    this._cubeTexture,
                    this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i
                );
            });
            spotLight.setParent(this);
        }
        this._spotLights[0].lookAtLocal(
            vec3.fromValues(1, 0, 0),
            vec3.fromValues(0, -1, 0)
        );
        this._spotLights[1].lookAtLocal(
            vec3.fromValues(-1, 0, 0),
            vec3.fromValues(0, -1, 0)
        );
        this._spotLights[2].lookAtLocal(
            vec3.fromValues(0, 1, 0),
            vec3.fromValues(0, 0, 1)
        );
        this._spotLights[3].lookAtLocal(
            vec3.fromValues(0, -1, 0),
            vec3.fromValues(0, 0, -1)
        );
        this._spotLights[4].lookAtLocal(
            vec3.fromValues(0, 0, 1),
            vec3.fromValues(0, -1, 0)
        );
        this._spotLights[5].lookAtLocal(
            vec3.fromValues(0, 0, -1),
            vec3.fromValues(0, -1, 0)
        );
        return this;
    }

    public drawWithLightCamera(renderParam: IBuildinRenderParamMaps) {
        for (const spotLight of this._spotLights) {
            this.gl.bindFramebuffer(
                this.gl.FRAMEBUFFER,
                spotLight.shadowFrameBuffer.active.glFramebuffer
            );
            spotLight.drawWithLightCamera(renderParam);
        }
    }

    public clearShadowFrameBuffer() {
        for (const spotLight of this._spotLights) {
            spotLight.clearShadowFrameBuffer();
        }
    }

    public getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D {
        const viewMatrix = mat4.multiply(
            mat4.create(),
            camera.projectionMatrix,
            camera.worldToObjectMatrix
        );
        const viewDir = vec3.sub(vec3.create(), this.position, camera.position);
        const upSide = vec3.normalize(vec3.create(), camera.upVector);
        const rightSide = vec3.create();
        vec3.cross(rightSide, upSide, viewDir);
        vec3.normalize(rightSide, rightSide);
        vec3.scale(upSide, upSide, this.radius);
        vec3.scale(rightSide, rightSide, this.radius);

        let lightUpPoint = vec3.add(vec3.create(), this.position, upSide);
        let lightRightPoint = vec3.add(vec3.create(), this.position, rightSide);
        const screenPos = vec3.transformMat4(
            vec3.create(),
            this._position,
            viewMatrix
        );

        lightUpPoint = vec3.transformMat4(
            vec3.create(),
            lightUpPoint,
            viewMatrix
        );
        lightRightPoint = vec3.transformMat4(
            vec3.create(),
            lightRightPoint,
            viewMatrix
        );
        const screenH = Math.abs(
            vec3.len(vec3.sub(vec3.create(), lightUpPoint, screenPos))
        );
        const screenW = Math.abs(
            vec3.len(vec3.sub(vec3.create(), lightRightPoint, screenPos))
        );
        return {
            left: screenPos[0] - screenW,
            right: screenPos[0] + screenW,
            top: -screenPos[1] + screenH,
            bottom: -screenPos[1] - screenH
        };
    }
}
