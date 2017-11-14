/// <reference types="gl-matrix" />
/// <reference types="webgl-ext" />
declare module "DataTypeEnum" {
    export enum DataType {
        float = 0,
        int = 1,
        vec2 = 2,
        vec3 = 3,
        vec4 = 4,
        mat2 = 5,
        mat3 = 6,
        mat4 = 7,
    }
}
declare module "IAsyncResource" {
    export interface IAsyncResource {
        asyncFinished(): Promise<IAsyncResource>;
        setAsyncFinished(promise: Promise<IAsyncResource>): void;
    }
}
declare module "cameras/OrthoCamera" {
    import { Camera } from "cameras/Camera";
    export class OrthoCamera extends Camera {
        protected _left: number;
        protected _right: number;
        protected _bottom: number;
        protected _top: number;
        protected _baseSize: number;
        constructor(parameters?: {
            left?: number;
            right?: number;
            bottom?: number;
            top?: number;
            near?: number;
            far?: number;
        });
        setLeft(left: number): void;
        readonly left: number;
        readonly right: number;
        readonly top: number;
        readonly bottom: number;
        compuseProjectionMatrix(): void;
        deCompuseProjectionMatrix(): void;
        setAspectRadio(radio: number): this;
    }
}
declare module "Dirtyable" {
    export interface IDirtyable {
        clean(...args: any[]): any;
    }
}
declare module "textures/Texture" {
    import { IAsyncResource } from "IAsyncResource";
    export class Texture implements IAsyncResource {
        readonly glTexture: WebGLTexture;
        protected _asyncFinished: Promise<Texture>;
        protected _image: HTMLImageElement;
        private _target;
        private _format;
        private _wrapS;
        private _wrapT;
        private _magFilter;
        private _minFilter;
        private _type;
        constructor(gl: WebGLRenderingContext, url?: string);
        readonly image: HTMLImageElement;
        readonly target: number;
        readonly format: number;
        readonly wrapS: number;
        readonly wrapT: number;
        readonly magFilter: number;
        readonly minFilter: number;
        readonly type: number;
        setTarget(_target: number): this;
        setFormat(_format: number): this;
        setWrapS(_wrapS: number): this;
        setWrapT(_wrapT: number): this;
        setMagFilter(_magFilter: number): this;
        setMinFilter(_minFilter: number): this;
        setType(_type: number): this;
        setAsyncFinished(promise: Promise<Texture>): void;
        asyncFinished(): Promise<Texture>;
        apply(gl: WebGLRenderingContext): this;
    }
}
declare module "renderer/GraphicsUtils" {
    import { Geometry } from "geometries/Geometry";
    import { IRenderParamHolder } from "shader/Program";
    export namespace Graphics {
        function getRenderParamHost(obj: any, logError?: boolean): IRenderParamHolder;
        function copyDataToVertexBuffer(gl: WebGLRenderingContext, geometry: Geometry): void;
        function logEnabledAttribute(gl: WebGLRenderingContext, program: WebGLProgram): void;
        function logIfFrameBufferInvalid(gl: WebGLRenderingContext, frameBuffer: WebGLFramebuffer): boolean;
        function initWebwebglContext(canvas: any, debug?: boolean): WebGLRenderingContext;
        function createEntileShader(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram;
    }
}
declare module "geometries/Geometry" {
    import { IDirtyable } from "Dirtyable";
    import { Attribute } from "shader/Program";
    export class Faces {
        buffer: WebGLBuffer;
        data: number[];
        constructor(gl: WebGLRenderingContext, data: number[]);
    }
    export class Geometry implements IDirtyable {
        attributes: {
            [index: string]: Attribute;
        };
        faces: Faces;
        protected _dirty: boolean;
        protected gl: WebGLRenderingContext;
        constructor(gl: WebGLRenderingContext);
        build(): this;
        assertValid(): this;
        setAttribute(name: any, attribute: Attribute): this;
        addVertex(vertex: any): this;
        removeAttribute(name: string): this;
        getVertexByIndex(index: number): any;
        getTriangleByIndex(triangleIndex: number): any[];
        generateFlatNormal(): this;
        clean(gl: WebGLRenderingContext): void;
    }
}
declare module "geometries/SphereGeometry" {
    import { Geometry } from "geometries/Geometry";
    export class SphereGeometry extends Geometry {
        private _radius;
        private _widthSegments;
        private _heightSegments;
        private _phiStart;
        private _phiLength;
        private _thetaStart;
        private _thetaLength;
        constructor(gl: WebGLRenderingContext);
        build(): this;
        readonly radius: number;
        readonly widthSegments: number;
        readonly heightSegments: number;
        readonly phiStart: number;
        readonly phiLength: number;
        readonly thetaStart: number;
        readonly thetaLength: number;
        setRadius(radius: number): this;
        setWidthSegments(widthSegments: number): this;
        setHeightSegments(heightSegments: number): this;
        setPhiStart(phiStart: number): this;
        setPhiLength(phiLength: number): this;
        setThetaStart(thetaStart: number): this;
        setThetaLength(thetaLength: number): this;
    }
}
declare module "Intersections/BoundingBox" {
    export interface BoundingBox2D {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }
}
declare module "materials/Material" {
    import { vec4 } from "gl-matrix";
    import { Program } from "shader/Program";
    export let colors: {
        black: vec4;
        gray: vec4;
        red: vec4;
        white: vec4;
    };
    export abstract class Material {
        defines: string[];
        shader: Program;
        constructor(gl: WebGLRenderingContext);
        protected abstract initShader(gl: WebGLRenderingContext): Program;
    }
}
declare module "Mesh" {
    import { mat4 } from "gl-matrix";
    import { Geometry } from "geometries/Geometry";
    import { Material } from "materials/Material";
    import { Object3d } from "Object3d";
    export class Mesh extends Object3d {
        readonly geometry: Geometry;
        materials: Material[];
        readonly matrix: mat4;
        readonly normalMatrix: mat4;
        constructor(geometry: Geometry, materials: Material[]);
        drawMode(gl: WebGLRenderingContext): number;
    }
}
declare module "geometries/RectGeometry" {
    import { Geometry } from "geometries/Geometry";
    export class RectGeometry extends Geometry {
        constructor(gl: WebGLRenderingContext);
    }
}
declare module "renderer/FrameBuffer" {
    import { Texture } from "textures/Texture";
    export enum AttachmentType {
        Texture = 0,
        RenderBuffer = 1,
    }
    export class Attachment {
        readonly frameBuffer: FrameBuffer;
        glRenderBuffer: WebGLRenderbuffer;
        targetTexture: Texture;
        readonly attachmentCode: (gl: WebGLRenderingContext | WebGLDrawBuffers) => number;
        private _innerFormatForBuffer;
        private _type;
        private _isAble;
        constructor(frameBuffer: FrameBuffer, attachmentCode: (gl: WebGLRenderingContext | WebGLDrawBuffers) => number);
        readonly innerFormatForBuffer: number;
        readonly type: AttachmentType;
        readonly isAble: boolean;
        enable(): this;
        disable(): this;
        setInnerFormatForBuffer(innerFormatForBuffer: number): this;
        setType(gl: WebGLRenderingContext, type: AttachmentType): this;
    }
    export class FrameBuffer {
        glFramebuffer: WebGLFramebuffer;
        attachments: {
            color: Attachment;
            depth: Attachment;
            stencil: Attachment;
        };
        extras: Attachment[];
        private _attached;
        private _width;
        private _height;
        constructor(gl: WebGLRenderingContext);
        setWidth(_width: number): this;
        setHeight(_height: number): this;
        readonly attached: boolean;
        readonly width: number;
        readonly height: number;
        attach(gl: WebGLRenderingContext, drawBuffer?: WebGLDrawBuffers): void;
        private linkAttachment(attachment, gl, context);
    }
}
declare module "renderer/IExtension" {
    export interface WebGLExtension {
        depth_texture: WebGLDepthTexture;
        draw_buffer: WebGLDrawBuffers;
        texture_float: OESTextureFloat;
        texture_float_linear: OESTextureFloatLinear;
        texture_half_float: OESTextureHalfFloat;
    }
}
declare module "lights/ShadowType" {
    export enum ShadowType {
        None = 0,
        Hard = 1,
        Soft = 2,
    }
}
declare module "lights/Light" {
    import { mat4, vec3 } from "gl-matrix";
    import { Camera } from "cameras/Camera";
    import { Geometry } from "geometries/Geometry";
    import { BoundingBox2D } from "Intersections/BoundingBox";
    import { Object3d } from "Object3d";
    import { FrameBuffer } from "renderer/FrameBuffer";
    import { WebGLExtension } from "renderer/IExtension";
    import { Renderer } from "renderer/Renderer";
    import { IBuildinRenderParamMaps } from "shader/Program";
    import { Texture } from "textures/Texture";
    import { ShadowType } from "lights/ShadowType";
    export abstract class Light extends Object3d {
        volume: Geometry;
        protected _color: vec3;
        protected _idensity: number;
        protected _shadowMap: Texture;
        protected _shadowFrameBuffer: FrameBuffer;
        protected _blurFrameBuffer: FrameBuffer;
        protected _shadowType: ShadowType;
        protected _projectCamera: Camera;
        protected _shadowSize: number;
        protected gl: WebGLRenderingContext;
        protected ext: WebGLExtension;
        constructor(renderer: Renderer);
        abstract getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D;
        setColor(color: vec3): this;
        setIdensity(idensity: number): this;
        setShadowType(shadowType: ShadowType): this;
        setShadowSize(shadowSize: number): this;
        readonly shadowType: ShadowType;
        readonly shadowSize: number;
        readonly shadowMap: Texture;
        readonly shadowFrameBuffer: FrameBuffer;
        readonly blurFrameBuffer: FrameBuffer;
        readonly typename: string;
        readonly color: vec3;
        readonly idensity: number;
        readonly projectionMatrix: mat4;
        readonly viewMatrix: mat4;
        readonly far: number;
        readonly near: number;
        drawWithLightCamera(renderParam: IBuildinRenderParamMaps): void;
        protected abstract setUpProjectionCamera(): any;
        protected configShadowFrameBuffer(): this;
    }
}
declare module "lights/PointLight" {
    import { vec3 } from "gl-matrix";
    import { Camera } from "cameras/Camera";
    import { BoundingBox2D } from "Intersections/BoundingBox";
    import { Renderer } from "renderer/Renderer";
    import { Light } from "lights/Light";
    export class PointLight extends Light {
        readonly position: vec3;
        protected _radius: number;
        protected _squareAttenuation: number;
        protected _linearAttenuation: number;
        protected _constantAttenuation: number;
        protected _pcssArea: number;
        constructor(renderer: Renderer);
        readonly squareAttenuation: number;
        readonly linearAttenuation: number;
        readonly constantAttenuation: number;
        readonly pcssArea: number;
        getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D;
        setRadius(radius: number): this;
        readonly typename: string;
        readonly radius: number;
        protected setUpProjectionCamera(): void;
    }
}
declare module "shader/shaders" {
    export namespace ShaderSource {
        const calculators__blinn_phong_glsl = "vec3 calculateLight(\n    vec3 position,\n    vec3 normal,\n    vec3 lightDir,\n    vec3 eyePos,\n    vec3 specular,\n    vec3 diffuse,\n    float shiness,\n    float idensity\n    ) {\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize(eyePos - position);\n\n    // replace R * V with N * H\n    vec3 H = (lightDir + viewDir) / length(lightDir + viewDir);\n    float specularAngle = max(dot(H, normal), 0.0);\n\n    vec3 specularColor = specular * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    vec3 color = (diffuseColor + specularColor) * idensity;\n    return color;\n}\n";
        const calculators__blur__gaussian_glsl = "vec4 gaussian_blur(sampler2D origin, vec2 uv, float blurStep, vec2 blurDir) {\n    vec4 average = vec4(0.0, 0.0, 0.0, 0.0);\n    average += texture2D(origin, uv - 4.0 * blurStep * blurDir) * 0.0162162162;\n    average += texture2D(origin, uv - 3.0 * blurStep * blurDir) * 0.0540540541;\n    average += texture2D(origin, uv - 2.0 * blurStep * blurDir) * 0.1216216216;\n    average += texture2D(origin, uv - 1.0 * blurStep * blurDir) * 0.1945945946;\n    average += texture2D(origin, uv) * 0.2270270270;\n    average += texture2D(origin, uv + 1.0 * blurStep * blurDir) * 0.1945945946;\n    average += texture2D(origin, uv + 2.0 * blurStep * blurDir) * 0.1216216216;\n    average += texture2D(origin, uv + 3.0 * blurStep * blurDir) * 0.0540540541;\n    average += texture2D(origin, uv + 4.0 * blurStep * blurDir) * 0.0162162162;\n    return average;\n}\n";
        const calculators__blur__gaussian_log_glsl = "\n";
        const calculators__linearlize_depth_glsl = "float linearlizeDepth(float far, float near, float depth) {\n    float NDRDepth = depth * 2.0 - 1.0;;\n    return 2.0 * near / (near + far - NDRDepth * (far - near));\n}\n";
        const calculators__packFloat1x32_glsl = "vec4 packFloat1x32(float val)\n{\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\n    pack = fract(pack);\n    pack -= vec4(pack.yzw / 255.0, 0.0);\n    return pack;\n}\n";
        const calculators__phong_glsl = "vec3 calculateLight(\n    vec3 position,\n    vec3 normal,\n    vec3 lightDir,\n    vec3 eyePos,\n    vec3 specularLight,\n    vec3 diffuseLight,\n    float shiness,\n    float idensity\n    ) {\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize(eyePos - position);\n    float specularAngle = max(dot(reflectDir, viewDir), 0.0);\n    vec3 specularColor = specularLight * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n";
        const calculators__shadow_factor_glsl = "float getSpotDirectionShadow(vec2 clipPos, sampler2D shadowMap, float linearDepth, float lambertian, float texelSize)\n{\n    vec2 uv = clipPos * 0.5 + 0.5;\n    \n    vec2 f = fract(uv / texelSize - 0.5);\n    vec2 centroidUV = (floor(uv / texelSize - 0.5)) * texelSize;\n\n    float lb = texture2D(shadowMap, centroidUV + texelSize * vec2(0.0, 0.0)).r;\n    float lt = texture2D(shadowMap, centroidUV + texelSize * vec2(0.0, 1.0)).r;\n    float rb = texture2D(shadowMap, centroidUV + texelSize * vec2(1.0, 0.0)).r;\n    float rt = texture2D(shadowMap, centroidUV + texelSize * vec2(1.0, 1.0)).r;\n    float a = lb + log(mix(1.0, exp(lt - lb), f.y));\n    float b = rb + log(mix(1.0, exp(rt - rb), f.y));\n    float z = a + log(mix(1.0, exp(b - a), f.x));\n\n    float bias = clamp(0.1 * tan(acos(lambertian)), 0.0, 1.0);\n\n    float s = exp((z + bias - linearDepth));\n\n    return min(s, 1.0);\n}\n";
        const calculators__types_glsl = "vec3 calculateDirLight(\n    DirectLight light,\n    vec3 materialDiff,\n    vec3 materialSpec,\n    float materialSpecExp,\n    vec3 position,\n    vec3 normal,\n    vec3 eyePos\n    ) {\n    return calculateLight(\n        position,\n        normal,\n        -light.direction,\n        eyePos,\n        light.color * materialSpec,\n        light.color * materialDiff,\n        materialSpecExp,\n        light.idensity\n    );\n}\n\nvec3 calculatePointLight(\n    PointLight light,\n    vec3 materialDiff,\n    vec3 materialSpec,\n    float materialSpecExp,\n    vec3 position,\n    vec3 normal,\n    vec3 eyePos\n    ) {\n    float lightDis = length(light.position - position);\n    float idensity = light.idensity / (light.constantAtten + light.linearAtten * lightDis + light.squareAtten * lightDis * lightDis);\n    idensity *= step(lightDis, light.radius);\n    return calculateLight(\n        position,\n        normal,\n        normalize(light.position - position),\n        eyePos,\n        light.color * materialSpec,\n        light.color * materialDiff,\n        materialSpecExp,\n        idensity\n    );\n}\n\nvec3 calculateSpotLight(\n    SpotLight light,\n    vec3 materialDiff,\n    vec3 materialSpec,\n    float materialSpecExp,\n    vec3 position,\n    vec3 normal,\n    vec3 eyePos\n    ) {\n    vec3 lightDir = normalize(light.position - position);\n    float spotFactor = dot(-lightDir, light.spotDir);\n    if (spotFactor < light.coneAngleCos) {\n        return vec3(0.0);\n    }\n    float lightDis = length(light.position - position);\n    float idensity = light.idensity / (light.constantAtten + light.linearAtten * lightDis + light.squareAtten * lightDis * lightDis);\n    idensity *= (spotFactor - light.coneAngleCos) / (1.0 - light.coneAngleCos);\n    // idensity *= step(light.radius, lightDis);\n    return calculateLight(\n        position,\n        normal,\n        lightDir,\n        eyePos,\n        light.color * materialSpec,\n        light.color * materialDiff,\n        materialSpecExp,\n        idensity\n    );\n}\n\n// float directAndSpotShadow(sampler2D shadowMap, vec4 shadowCoord) {\n//\n// }\n";
        const calculators__unpackFloat1x32_glsl = "float unpackFloat1x32( vec4 rgba ) {\n  return dot( rgba, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 160581375.0) );\n}\n";
        const debug__checkBox_glsl = "float checkerBoard(in vec2 uv, in float subSize) {\n    vec2 bigBox = mod(uv, vec2(subSize * 2.0));\n    return (\n        step(subSize, bigBox.x) * step(subSize, bigBox.y)\n        + step(subSize, subSize * 2.0 -bigBox.x) * step(subSize, subSize * 2.0 -bigBox.y)\n    );\n}\n";
        const definitions__light_glsl = "struct DirectLight\n{\n    vec3 color;\n    float idensity;\n    vec3 direction;\n#ifdef USE_SHADOW\n    sampler2D shadowMap;\n    float shadowMapSize;\n    mat4 projectionMatrix;\n    mat4 viewMatrix;\n#endif\n};\n\nstruct PointLight {\n    vec3 color;\n    float idensity;\n    float radius;\n    vec3 position;\n    float squareAtten;\n    float linearAtten;\n    float constantAtten;\n#ifdef USE_SHADOW\n    sampler2D shadowMap;\n    float shadowMapSize;\n    mat4 projectionMatrix;\n    mat4 viewMatrix;\n    float pcssArea;\n#endif\n};\n\nstruct SpotLight {\n    vec3 color;\n    float idensity;\n    float radius;\n    vec3 position;\n    float squareAtten;\n    float linearAtten;\n    float constantAtten;\n    float coneAngleCos;\n    vec3 spotDir;\n#ifdef USE_SHADOW\n    sampler2D shadowMap;\n    float shadowMapSize;\n    mat4 projectionMatrix;\n    mat4 viewMatrix;\n    float pcssArea;\n#endif\n};\n";
        const interploters__deferred__geometry_frag = "uniform vec3 ambient;\nuniform vec3 materialDiff;\nuniform vec3 materialSpec;\nuniform float materialSpecExp;\n\n\n#ifdef OPEN_LIGHT\nuniform vec3 eyePos;\nvarying vec3 vNormal;\n#endif\n\n#ifdef _MAIN_TEXTURE\nuniform sampler2D uMainTexture;\nvarying vec2 vMainUV;\n#endif\n\n#ifdef _NORMAL_TEXTURE\nuniform sampler2D uNormalTexture;\nvarying vec2 vNormalUV;\n#endif\n\nvec2 encodeNormal(vec3 n) {\n    return normalize(n.xy) * (sqrt(n.z*0.5+0.5));\n}\n\nvoid main () {\n\n#ifdef OPEN_LIGHT\n    vec3 normal = normalize(vNormal);\n    float specular = (materialSpec.x + materialSpec.y + materialSpec.z) / 3.0;\n#ifdef _NORMAL_TEXTURE\n    gl_FragData[0] = vec4(encodeNormal(normal), gl_FragCoord.z, materialSpecExp);\n#else\n    gl_FragData[0] = vec4(encodeNormal(normal), gl_FragCoord.z, materialSpecExp);\n#endif\n#ifdef _MAIN_TEXTURE\n    gl_FragData[1] = vec4(materialDiff * texture2D(uMainTexture, vMainUV).xyz, specular);\n#else\n    gl_FragData[1] = vec4(materialDiff, specular);\n#endif\n#endif\n}\n";
        const interploters__deferred__geometry_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\n#ifdef _MAIN_TEXTURE\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n#endif\n\n#ifdef OPEN_LIGHT\nuniform mat4 normalViewMatrix;\nattribute vec3 aNormal;\nvarying vec3 vNormal;\n#endif\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vNormal = (normalViewMatrix * vec4(aNormal, 1.0)).xyz;\n#endif\n\n#ifdef _MAIN_TEXTURE\n    vMainUV = aMainUV;\n#endif\n}\n";
        const interploters__deferred__tiledLight_frag = "#define MAX_TILE_LIGHT_NUM 32\n\nprecision highp float;\n\nuniform float uHorizontalTileNum;\nuniform float uVerticalTileNum;\nuniform float uLightListLengthSqrt;\n\nuniform mat4 inverseProjection;\n\nuniform sampler2D uLightIndex;\nuniform sampler2D uLightOffsetCount;\nuniform sampler2D uLightPositionRadius;\nuniform sampler2D uLightColorIdensity;\n\nuniform sampler2D uNormalDepthSE;\nuniform sampler2D uDiffSpec;\n\nuniform float cameraNear;\nuniform float cameraFar;\n\n\nvarying vec3 vPosition;\n\nvec3 decodeNormal(vec2 n)\n{\n   vec3 normal;\n   normal.z = dot(n, n) * 2.0 - 1.0;\n   normal.xy = normalize(n) * sqrt(1.0 - normal.z * normal.z);\n   return normal;\n}\n\nvec3 decodePosition(float depth) {\n    vec4 clipSpace = vec4(vPosition.xy, depth * 2.0 - 1.0, 1.0);\n    vec4 homogenous = inverseProjection * clipSpace;\n    return homogenous.xyz / homogenous.w;\n}\n\nvoid main() {\n    vec2 uv = vPosition.xy * 0.5 + vec2(0.5);\n    vec2 gridIndex = uv ;// floor(uv * vec2(uHorizontalTileNum, uVerticalTileNum)) / vec2(uHorizontalTileNum, uVerticalTileNum);\n    vec4 lightIndexInfo = texture2D(uLightOffsetCount, gridIndex);\n    float lightStartIndex = lightIndexInfo.r;\n    float lightNum = lightIndexInfo.w;\n    vec4 tex1 = texture2D(uNormalDepthSE, uv);\n    vec4 tex2 = texture2D(uDiffSpec, uv);\n\n    vec3 materialDiff = tex2.xyz;\n    vec3 materialSpec = vec3(tex2.w);\n    float materialSpecExp = tex1.w;\n\n    vec3 normal = decodeNormal(tex1.xy);\n    vec3 viewPosition = decodePosition(tex1.z);\n    vec3 totalColor = vec3(0.0);\n    int realCount = 0;\n    for(int i = 0; i < MAX_TILE_LIGHT_NUM; i++) {\n        if (float(i) > lightNum - 0.5) {\n            break;\n        }\n        // float listX = (float(lightStartIndex + i) - listX_int * uLightListLengthSqrt) / uLightListLengthSqrt;\n        // float listY = ((lightStartIndex + i) / uLightListLengthSqrt) / uLightListLengthSqrt;\n        // float listX = (mod(lightStartIndex + i, uLightListLengthSqrt)) / uLightListLengthSqrt;\n        // listX = 1.0;\n        // listY = 0.0;\n        float fixlightId = texture2D(uLightIndex, vec2((lightStartIndex + float(i)) / uLightListLengthSqrt, 0.5)).x;\n        vec4 lightPosR = texture2D(uLightPositionRadius, vec2(fixlightId, 0.5));\n        vec3 lightPos = lightPosR.xyz;\n        float lightR = lightPosR.w;\n        vec4 lightColorIden = texture2D(uLightColorIdensity, vec2(fixlightId, 0.5));\n        vec3 lightColor = lightColorIden.xyz;\n        float lightIdensity = lightColorIden.w;\n\n        float dist = distance(lightPos, viewPosition);\n        if (dist < lightR) {\n            realCount++;\n            vec3 fixLightColor = lightColor * min(1.0,  1.0 / (dist * dist ) / (lightR * lightR));\n            totalColor += calculateLight(\n                viewPosition,\n                normal,\n                normalize(lightPos - viewPosition),\n                vec3(0.0),\n                materialSpec * lightColor,\n                materialDiff * lightColor,\n                materialSpecExp,\n                lightIdensity\n            );\n            // totalColor += vec3(listX, listY, 0.0);\n        }\n            // vec3 lightDir = normalize(lightPos - viewPosition);\n            // vec3 reflectDir = normalize(reflect(lightDir, normal));\n            // vec3 viewDir = normalize( - viewPosition);\n            // vec3 H = normalize(lightDir + viewDir);\n            // float specularAngle = max(dot(H, normal), 0.0);\n            // // vec3 specularColor = materialSpec * pow(specularAngle, materialSpecExp);\n        // totalColor = vec3(float(lightStartIndex) / uLightListLengthSqrt / uLightListLengthSqrt);\n        //}\n        //}\n    }\n    // vec3 depth = vec3(linearlizeDepth(cameraFar, cameraNear, tex1.z));\n    // vec3 depth = vec3(tex1.z);\n    vec3 test = vec3(float(realCount) / 32.0);\n    gl_FragColor = vec4(totalColor, 1.0);\n}\n";
        const interploters__deferred__tiledLight_vert = "attribute vec3 position;\nvarying vec3 vPosition;\n\nvoid main()\n{\n    gl_Position = vec4(position, 1.0);\n    vPosition = position;\n}\n";
        const interploters__forward__esm__blur_frag = "uniform sampler2D uOrigin;\nuniform vec2 uBlurDir;\nuniform float uBlurStep;\n\nuniform float lightArea;\n\n#define MAX_BLOCK_SAMPLE 8.0\n#define MAX_PCF_SAMPLE 8.0\n\nuniform float blockSamples;\nuniform float PCFSamples;\n\nvarying vec4 vProjPos;\nvarying vec3 vNormal;\n\nvoid main () {\n    vec2 uv = vProjPos.xy * 0.5 + 0.5;\n    float base = texture2D(uOrigin, uv).r;\n    float block = 0.0;\n    gl_FragColor.r = base;\n\n    for (float i = 0.0; i < MAX_BLOCK_SAMPLE; ++i) {\n        if(i >= blockSamples) {\n            break;\n        }\n        float d = texture2D(uOrigin, uv + (i - blockSamples / 2.0) * uBlurStep * uBlurDir).r;\n        block += step(base, d) * d / blockSamples;\n    }\n    \n    float kenelSize = lightArea * (base - block) / base;\n\n    float sum = 0.0;\n\n    for (float i = 0.0; i < MAX_PCF_SAMPLE; ++i) {\n        if(i >= PCFSamples) {\n            break;\n        }\n        float expd = exp(texture2D(uOrigin, uv + (i - PCFSamples / 2.0) * kenelSize * uBlurStep * uBlurDir).r - base);\n        sum += expd / PCFSamples;\n    }\n\n    float average = log(sum) + base;\n\n    gl_FragColor.r += average;\n}\n";
        const interploters__forward__esm__blur_vert = "uniform mat4 normalMatrix;\nattribute vec3 position;\nattribute vec3 normal;\nvarying vec4 vProjPos;\nvarying vec3 vNormal;\n\nvoid main () {\n    gl_Position = vProjPos = vec4(position, 1.0);\n    vNormal = normalize((normalMatrix * vec4(normal, 1.0)).xyz);\n}\n";
        const interploters__forward__esm__depth_frag = "varying vec3 viewPos;\n\nvoid main () {\n    gl_FragColor.r = -viewPos.z;\n}\n";
        const interploters__forward__esm__depth_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\nuniform mat4 modelViewMatrix;\nvarying vec3 viewPos;\n\nvoid main () {\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n    viewPos = (modelViewMatrix * vec4(position, 1.0)).xyz;\n}\n";
        const interploters__forward__gouraud_frag = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\nvoid main() {\n    textureColor = colorOrMainTexture(vMainUV);\n#ifdef OPEN_LIGHT\n    totalLighting = ambient;\n    vec3 normal = normalize(vNormal);\n    gl_FragColor = vec4(totalLighting, 1.0);\n#else\n#ifdef USE_COLOR\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n#endif\n#endif\n#ifdef _MAIN_TEXTURE\n    gl_FragColor = gl_FragColor * textureColor;\n#endif\n#ifdef USE_COLOR\n    gl_FragColor = gl_FragColor * color;\n#endif\n}\n";
        const interploters__forward__gouraud_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vec3 normal = (normalMatrix * vec4(aNormal, 0.0)).xyz;\n    totalLighting = ambient;\n    normal = normalize(normal);\n    for (int index = 0; index < LIGHT_NUM; index++) {\n        totalLighting += calculate_light(gl_Position, normal, lights[index].position, eyePos, lights[index].specular, lights[index].diffuse, 4, lights[index].idensity);\n    }\n    vLightColor = totalLighting;\n#endif\n#ifdef _MAIN_TEXTURE\n    vTextureCoord = aTextureCoord;\n#endif\n}\n";
        const interploters__forward__phong_frag = "uniform vec3 ambient;\nuniform vec3 uMaterialSpec;\nuniform float uMaterialSpecExp;\nuniform vec3 uMaterialDiff;\n\nuniform vec3 cameraPos;\n\nvarying vec2 vMainUV;\nvarying vec4 clipPos;\n\nvarying vec3 vNormal;\nvarying vec3 vPosition;\n\n#ifdef _MAIN_TEXTURE\nuniform sampler2D uMainTexture;\n#endif\n\n#ifdef _ENVIRONMENT_MAP\nuniform float reflectivity;\nuniform samplerCube uCubeTexture;\n#endif\n\n#if (directLightsNum > 0)\nuniform DirectLight directLights[directLightsNum];\n#endif\n\n#if (pointLightsNum > 0)\nuniform PointLight pointLights[pointLightsNum];\n#endif\n\n#if (spotLightsNum > 0)\nuniform SpotLight spotLights[spotLightsNum];\n#endif\n\n#ifdef USE_SHADOW\n\n    #if (directLightsNum > 0)\n    varying vec4 directShadowCoord[directLightsNum];\n    varying float directLightDepth[directLightsNum];\n    #endif\n\n    #if (pointLightsNum > 0)\n    varying vec4 pointShadowCoord[pointLightsNum];\n    varying float pointLightDepth[pointLightsNum];\n    #endif\n\n    #if (spotLightsNum > 0)\n    varying vec4 spotShadowCoord[spotLightsNum];\n    varying float spotLightDepth[spotLightsNum];\n    #endif\n\n#endif\n\nvoid main () {\n\n#ifdef _MAIN_TEXTURE\n    gl_FragColor = texture2D(uMainTexture, vMainUV);\n#else\n    #ifdef _DEBUG\n    gl_FragColor = vec4(vec3(checkerBoard(vMainUV, 0.1)), 1.0);\n    #else\n    gl_FragColor = vec4(1.0);\n    #endif\n#endif\n    vec3 color = vec3(0.0);\n    vec3 normal = normalize(vNormal);\n    vec3 totalLighting = ambient;\n    #ifdef _ENVIRONMENT_MAP\n    vec3 viewDir = normalize(-vPosition);\n    vec3 skyUV = reflect(viewDir, vNormal);\n    totalLighting = mix(totalLighting, textureCube(uCubeTexture, skyUV).xyz, reflectivity);\n    #endif\n#if (directLightsNum > 0)\n    for (int index = 0; index < directLightsNum; index++) {\n        vec3 lighting = calculateDirLight(\n            directLights[index],\n            uMaterialDiff,\n            uMaterialSpec,\n            uMaterialSpecExp,\n            vPosition,\n            normal,\n            cameraPos\n        );\n    #ifdef USE_SHADOW\n        float lambertian = dot(-directLights[index].direction, normal);\n        float shadowFactor = getSpotDirectionShadow(\n            directShadowCoord[index].xy / directShadowCoord[index].w, \n            directLights[index].shadowMap, \n            directLightDepth[index], \n            lambertian, \n            1.0 / directLights[index].shadowMapSize\n        );\n        lighting *= shadowFactor;\n    #endif\n        totalLighting += lighting;\n    }\n#endif\n#if (pointLightsNum > 0)\n    for (int index = 0; index < pointLightsNum; index++) {\n        vec3 lighting = calculatePointLight(\n            pointLights[index],\n            uMaterialDiff,\n            uMaterialSpec,\n            uMaterialSpecExp,\n            vPosition,\n            normal,\n            cameraPos\n        );\n        totalLighting += lighting;\n    }\n#endif\n#if (spotLightsNum > 0)\n    for (int index = 0; index < spotLightsNum; index++) {\n        vec3 lighting = calculateSpotLight(\n            spotLights[index],\n            uMaterialDiff,\n            uMaterialSpec,\n            uMaterialSpecExp,\n            vPosition,\n            normal,\n            cameraPos\n        );\n    #ifdef USE_SHADOW\n        float lambertian = dot(-spotLights[index].spotDir, normal);\n        float shadowFactor = getSpotDirectionShadow(\n            spotShadowCoord[index].xy / spotShadowCoord[index].w, \n            spotLights[index].shadowMap,\n            spotLightDepth[index], \n            lambertian, 1.0 / spotLights[index].shadowMapSize\n        );\n        lighting *= shadowFactor;\n    #endif\n        totalLighting += lighting;\n\n    }\n#endif\n    color += totalLighting;\n    gl_FragColor *= vec4(color, 1.0);\n}\n";
        const interploters__forward__phong_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\nuniform mat4 modelMatrix;\n\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n\nuniform mat4 normalMatrix;\nattribute vec3 aNormal;\nvarying vec3 vNormal;\nvarying vec3 vPosition;\nvarying vec4 clipPos;\n\n\n#if (directLightsNum > 0)\nuniform DirectLight directLights[directLightsNum];\n    #ifdef USE_SHADOW\n    varying vec4 directShadowCoord[directLightsNum];\n    varying float directLightDepth[directLightsNum];\n    #endif\n#endif\n\n#if (pointLightsNum > 0)\nuniform PointLight pointLights[pointLightsNum];\n    #ifdef USE_SHADOW\n    varying vec4 pointShadowCoord[pointLightsNum];\n    varying float pointLightDepth[pointLightsNum];\n    #endif\n#endif\n\n#if (spotLightsNum > 0)\nuniform SpotLight spotLights[spotLightsNum];\n    #ifdef USE_SHADOW\n    varying vec4 spotShadowCoord[spotLightsNum];\n    varying float spotLightDepth[spotLightsNum];\n    #endif\n#endif\n\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n    clipPos = gl_Position;\n    vec4 worldPos = (modelMatrix * vec4(position, 1.0));\n    vPosition = worldPos.xyz;\n    vNormal = (normalMatrix * vec4(aNormal, 1.0)).xyz;\n    vMainUV = aMainUV;\n\n    #ifdef USE_SHADOW\n        #if (directLightsNum > 0)\n        for (int i = 0; i < directLightsNum; ++i) {\n            directShadowCoord[i] = directLights[i].projectionMatrix * directLights[i].viewMatrix * worldPos;\n            directLightDepth[i] = -(directLights[i].viewMatrix * worldPos).z;\n        }\n        #endif\n\n        #if (pointLightsNum > 0)\n        for (int i = 0; i < pointLightsNum; ++i) {\n            pointShadowCoord[i] = pointLights[i].projectionMatrix * pointLights[i].viewMatrix * worldPos;\n            pointLightDepth[i] = -(pointLights[i].viewMatrix * worldPos).z;\n        }\n        #endif\n\n        #if (spotLightsNum > 0)\n        for (int i = 0; i < spotLightsNum; ++i) {\n            spotShadowCoord[i] = spotLights[i].projectionMatrix * spotLights[i].viewMatrix * worldPos;\n            spotLightDepth[i] = -(spotLights[i].viewMatrix * worldPos).z;\n        }\n        #endif\n    #endif\n}\n";
        const interploters__forward__skybox_frag = "varying vec3 cubeUV;\nuniform samplerCube uCubeTexture;\nvoid main()\n{\n    gl_FragColor = textureCube(uCubeTexture, cubeUV);\n}\n";
        const interploters__forward__skybox_vert = "attribute vec3 position;\nuniform mat4 viewProjectionMatrix;\nvarying vec3 cubeUV;\n\nvoid main (){\n    vec4 mvp = viewProjectionMatrix * vec4(position, 1.0);\n    cubeUV = position;\n    gl_Position = mvp.xyww;\n}\n";
    }
    export type ShaderLib = typeof ShaderSource.calculators__blinn_phong_glsl | typeof ShaderSource.calculators__blur__gaussian_glsl | typeof ShaderSource.calculators__blur__gaussian_log_glsl | typeof ShaderSource.calculators__linearlize_depth_glsl | typeof ShaderSource.calculators__packFloat1x32_glsl | typeof ShaderSource.calculators__phong_glsl | typeof ShaderSource.calculators__shadow_factor_glsl | typeof ShaderSource.calculators__types_glsl | typeof ShaderSource.calculators__unpackFloat1x32_glsl | typeof ShaderSource.debug__checkBox_glsl | typeof ShaderSource.definitions__light_glsl;
    export type ShadingVert = typeof ShaderSource.interploters__deferred__geometry_vert | typeof ShaderSource.interploters__deferred__tiledLight_vert | typeof ShaderSource.interploters__forward__esm__blur_vert | typeof ShaderSource.interploters__forward__esm__depth_vert | typeof ShaderSource.interploters__forward__gouraud_vert | typeof ShaderSource.interploters__forward__phong_vert | typeof ShaderSource.interploters__forward__skybox_vert;
    export type ShadingFrag = typeof ShaderSource.interploters__deferred__geometry_frag | typeof ShaderSource.interploters__deferred__tiledLight_frag | typeof ShaderSource.interploters__forward__esm__blur_frag | typeof ShaderSource.interploters__forward__esm__depth_frag | typeof ShaderSource.interploters__forward__gouraud_frag | typeof ShaderSource.interploters__forward__phong_frag | typeof ShaderSource.interploters__forward__skybox_frag;
}
declare module "shader/ShaderBuilder" {
    import { IRenderParamHolder, Program } from "shader/Program";
    import { ShaderLib, ShadingFrag, ShadingVert } from "shader/shaders";
    export class ShaderBuilder {
        private vertLibs;
        private fragLibs;
        private shadingVert;
        private shadingFrag;
        private extraRenderParamHolders;
        resetShaderLib(): this;
        addShaderLib(...lib: ShaderLib[]): this;
        addShaderLibVert(...lib: ShaderLib[]): this;
        addShaderLibFrag(...lib: ShaderLib[]): this;
        setShadingVert(vert: ShadingVert): this;
        setShadingFrag(frag: ShadingFrag): this;
        setExtraRenderParamHolder(name: string, paramHolder: IRenderParamHolder): this;
        build(gl: WebGLRenderingContext): Program;
    }
}
declare module "textures/CubeTexture" {
    import { Texture } from "textures/Texture";
    export class CubeTexture extends Texture {
        images: HTMLImageElement[];
        private _wrapR;
        constructor(gl: WebGLRenderingContext, xposUrl: string, xnegUrl: string, yposUrl: string, ynegUrl: string, zposUrl: string, znegUrl: string);
        readonly wrapR: number;
        setWrapR(_wrapR: number): this;
        apply(gl: WebGLRenderingContext): this;
        private createLoadPromise(image);
    }
}
declare module "materials/StandardMaterial" {
    import { vec3 } from "gl-matrix";
    import { Program } from "shader/Program";
    import { CubeTexture } from "textures/CubeTexture";
    import { Texture } from "textures/Texture";
    import { Material } from "materials/Material";
    export interface IStandardMaterial {
        mainTexture?: Texture;
        ambient?: vec3;
        diffuse?: vec3;
        specular?: vec3;
        program?: Program;
    }
    export class StandardMaterial extends Material {
        debug: boolean;
        castShadow: boolean;
        mainTexture: Texture;
        ambient: vec3;
        diffuse: vec3;
        specular: vec3;
        specularExponent: number;
        specularMap: Texture;
        transparency: number;
        alphaMap: Texture;
        bumpMap: Texture;
        displamentMap: Texture;
        stencilMap: Texture;
        reflectivity: number;
        reflectionMap: CubeTexture;
        geometryShader: Program;
        constructor(gl: WebGLRenderingContext, paramter?: IStandardMaterial);
        protected initShader(gl: WebGLRenderingContext): Program;
    }
}
declare module "textures/DataTexture" {
    import { Texture } from "textures/Texture";
    export class DataTexture<TypeArray extends ArrayBufferView> extends Texture {
        width: number;
        height: number;
        private data;
        constructor(gl: WebGLRenderingContext, data: TypeArray, width?: number, height?: number);
        resetData(gl: WebGLRenderingContext, data: TypeArray, width?: number, height?: number): this;
        apply(gl: WebGLRenderingContext): this;
    }
}
declare module "renderer/IProcessor" {
    import { Camera } from "cameras/Camera";
    import { Material } from "materials/Material";
    import { Scene } from "Scene";
    export interface IProcessor {
        process(scene: Scene, camera: Camera, matriels: Material[]): any;
    }
}
declare module "renderer/deferred/DeferredProcessor" {
    import { Camera } from "cameras/Camera";
    import { Material } from "materials/Material";
    import { Mesh } from "Mesh";
    import { Scene } from "Scene";
    import { Program } from "shader/Program";
    import { FrameBuffer } from "renderer/FrameBuffer";
    import { WebGLExtension } from "renderer/IExtension";
    import { IProcessor } from "renderer/IProcessor";
    export class DeferredProcessor implements IProcessor {
        tile: Mesh;
        readonly tilePixelSize: number;
        readonly horizontalTileNum: any;
        readonly verticalTileNum: any;
        readonly tileCount: any;
        readonly gBuffer: FrameBuffer;
        readonly gl: WebGLRenderingContext;
        readonly ext: WebGLExtension;
        tileProgram: Program;
        private tileLightIndexMap;
        private tileLightOffsetCountMap;
        private tileLightCountMap;
        private lightPositionRadiusMap;
        private lightColorIdensityMap;
        private tileLightIndex;
        private linearLightIndex;
        constructor(gl: WebGLRenderingContext, ext: WebGLExtension, scene: Scene, camera: Camera);
        process(scene: Scene, camera: Camera, materials: Material[]): void;
        private initGeometryProcess(scene);
        private tileLightPass(scene, camera);
        private initTiledPass(scene);
        private fillTileWithBoundingBox2D(camera, box, lightIndex);
    }
}
declare module "materials/ESM/DepthPackMaterial" {
    import { Program } from "shader/Program";
    import { Material } from "materials/Material";
    export class LinearDepthPackMaterial extends Material {
        protected initShader(gl: WebGLRenderingContext): Program;
    }
}
declare module "renderer/forward/ForwardProcessor" {
    import { Camera } from "cameras/Camera";
    import { Material } from "materials/Material";
    import { Scene } from "Scene";
    import { WebGLExtension } from "renderer/IExtension";
    import { IProcessor } from "renderer/IProcessor";
    export class ForwardProcessor implements IProcessor {
        readonly gl: WebGLRenderingContext;
        readonly ext: WebGLExtension;
        constructor(gl: WebGLRenderingContext, ext: WebGLExtension, scene: Scene, camera: Camera);
        process(scene: Scene, camera: Camera, materials: Material[]): void;
        private renderObject(scene, camera, object);
    }
}
declare module "textures/Texture2D" {
    import { Texture } from "textures/Texture";
    export class Texture2D extends Texture {
        constructor(gl: WebGLRenderingContext, url?: string);
        apply(gl: WebGLRenderingContext): this;
    }
}
declare module "materials/ESM/LogBlurMaterial" {
    import { vec2 } from "gl-matrix";
    import { Program } from "shader/Program";
    import { Texture2D } from "textures/Texture2D";
    import { Material } from "materials/Material";
    export class PCSSFilteringMaterial extends Material {
        origin: Texture2D;
        blurDirection: vec2;
        blurStep: number;
        protected initShader(gl: WebGLRenderingContext): Program;
    }
}
declare module "renderer/ShadowPreProcessor" {
    import { Camera } from "cameras/Camera";
    import { Material } from "materials/Material";
    import { Scene } from "Scene";
    import { WebGLExtension } from "renderer/IExtension";
    import { IProcessor } from "renderer/IProcessor";
    export class ShadowPreProcess implements IProcessor {
        private gl;
        private ext;
        private depthMaterial;
        private blurMaterial;
        private rectMesh;
        constructor(gl: WebGLRenderingContext, ext: WebGLExtension, scene: Scene);
        process(scene: Scene, camera: Camera, matriels: Material[]): void;
        private initPass(scene);
        private renderDepth(scene, light);
        private blurDepth(scene, light);
    }
}
declare module "renderer/Renderer" {
    import { Camera } from "cameras/Camera";
    import { Scene } from "Scene";
    import { Texture } from "textures/Texture";
    import { FrameBuffer } from "renderer/FrameBuffer";
    import { WebGLExtension } from "renderer/IExtension";
    export class Renderer {
        readonly canvas: HTMLCanvasElement;
        readonly gl: WebGLRenderingContext;
        readonly ext: WebGLExtension;
        debug: boolean;
        preloadRes: any[];
        usedTextureNum: number;
        renderTargets: Texture[];
        vertPrecision: string;
        fragPrecision: string;
        isAnimating: boolean;
        renderQueue: Array<(deltaTime: number) => void>;
        fbos: FrameBuffer[];
        scenes: Scene[];
        cameras: Camera[];
        frameRate: number;
        private stopped;
        private materials;
        private isDeferred;
        constructor(canvas: HTMLCanvasElement, debug?: boolean);
        stop(): void;
        start(): void;
        createFrameBuffer(): FrameBuffer;
        renderFBO(scene: Scene, camera: Camera): void;
        handleResource(scene: Scene): Promise<any[]>;
        forceDeferred(): void;
        render(scene: Scene, camera: Camera, adaptCanvasAspectRatio?: boolean): void;
        private renderLight(light, scene);
        private main;
        private initMatrix();
    }
}
declare module "lights/DirectionalLight" {
    import { vec3 } from "gl-matrix";
    import { Camera } from "cameras/Camera";
    import { BoundingBox2D } from "Intersections/BoundingBox";
    import { Renderer } from "renderer/Renderer";
    import { Light } from "lights/Light";
    export class DirectionalLight extends Light {
        constructor(renderer: Renderer);
        readonly typename: string;
        readonly direction: vec3;
        getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D;
        setDirection(_direction: vec3): this;
        protected setUpProjectionCamera(): void;
    }
}
declare module "cameras/PerspectiveCamera" {
    import { Camera } from "cameras/Camera";
    export class PerspectiveCamera extends Camera {
        protected _aspect: number;
        protected _fovy: number;
        constructor(parameter?: {
            aspect?: number;
            fovy?: number;
            near?: number;
            far?: number;
        });
        compuseProjectionMatrix(): void;
        readonly aspect: number;
        readonly fovy: number;
        setAspect(aspect: number): this;
        setFovy(fovy: number): this;
        deCompuseProjectionMatrix(): void;
        setAspectRadio(ratio: number): this;
    }
}
declare module "lights/SpotLight" {
    import { vec3 } from "gl-matrix";
    import { Camera } from "cameras/Camera";
    import { BoundingBox2D } from "Intersections/BoundingBox";
    import { Renderer } from "renderer/Renderer";
    import { PointLight } from "lights/PointLight";
    export class SpotLight extends PointLight {
        protected readonly coneAngleCos: number;
        protected _coneAngle: number;
        constructor(renderer: Renderer);
        readonly typename: string;
        readonly spotDirection: vec3;
        readonly coneAngle: number;
        setRadius(radius: number): this;
        setConeAngle(coneAngle: number): this;
        setSpotDirection(spotDirection: vec3): this;
        getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D;
        protected setUpProjectionCamera(): void;
    }
}
declare module "Scene" {
    import { vec3 } from "gl-matrix";
    import { DirectionalLight } from "lights/DirectionalLight";
    import { Light } from "lights/Light";
    import { PointLight } from "lights/PointLight";
    import { SpotLight } from "lights/SpotLight";
    import { Object3d } from "Object3d";
    export class Scene {
        objects: Object3d[];
        lights: Light[];
        ambientLight: vec3;
        openLight: boolean;
        clearColor: number[];
        programSetUp: boolean;
        directLights: DirectionalLight[];
        pointLights: PointLight[];
        spotLights: SpotLight[];
        private updateEvents;
        update(dt: number): void;
        addOnUpdateListener(listener: (deltaTime: number) => void): this;
        removeOnUpdateListener(listener: (deltaTime: number) => void): this;
        addObject(...objects: Object3d[]): this;
        removeObject(object: Object3d): this;
        addLight(...lights: Light[]): void;
    }
}
declare module "Object3d" {
    import { mat4, quat, vec3 } from "gl-matrix";
    import { IAsyncResource } from "IAsyncResource";
    import { Scene } from "Scene";
    export class Object3d implements IAsyncResource {
        tag: string;
        scene: Scene;
        children: Object3d[];
        depredations: string[];
        protected _worldToObjectMatrix: mat4;
        protected _asyncFinished: Promise<Object3d>;
        protected _matrix: mat4;
        protected _parent: Object3d;
        protected _localMatrix: mat4;
        protected _localPosition: vec3;
        protected _localRotation: quat;
        protected _localScaling: vec3;
        protected _position: vec3;
        protected _scaling: vec3;
        protected _rotation: quat;
        constructor(tag?: string);
        readonly parent: Object3d;
        setParent(_parent: Object3d): this;
        readonly localMatrix: mat4;
        readonly matrix: mat4;
        readonly worldToObjectMatrix: mat4;
        setWorldToObjectMatrix(worldToObjectMatrix: mat4): this;
        readonly localPosition: vec3;
        setLocalPosition(_localPosition: vec3): this;
        readonly position: vec3;
        setPosition(_position: vec3): this;
        readonly localRotation: quat;
        setLocalRotation(_localRotation: quat): this;
        readonly rotation: quat;
        setRotation(_rotation: quat): this;
        readonly localScaling: vec3;
        setLocalScaling(_localScaling: vec3): this;
        readonly scaling: vec3;
        setScaling(_scaling: vec3): this;
        setTransformFromParent(): this;
        translate(delta: vec3): this;
        rotateX(angle: number): this;
        rotateY(angle: number): this;
        rotateZ(angle: number): this;
        lookAt(center: vec3): this;
        handleUniformProperty(): void;
        asyncFinished(): Promise<Object3d>;
        setAsyncFinished(promise: Promise<Object3d>): void;
        protected genOtherMatrixs(): void;
        protected deComposeLocalMatrix(): void;
        protected composeFromLocalTransform(): void;
        protected deComposeGlobalMatrix(): void;
        private composeFromGlobalTransform();
        private applyToChildren();
    }
}
declare module "cameras/Camera" {
    import { mat4, vec3 } from "gl-matrix";
    import { Object3d } from "Object3d";
    export abstract class Camera extends Object3d {
        protected _upVector: vec3;
        protected _centerVector: vec3;
        protected _rightVector: vec3;
        protected _projectionMatrix: mat4;
        protected _near: number;
        protected _far: number;
        constructor();
        readonly position: vec3;
        readonly near: number;
        readonly far: number;
        readonly eyeVector: vec3;
        readonly upVector: vec3;
        readonly centerVector: vec3;
        readonly rightVector: vec3;
        readonly projectionMatrix: mat4;
        lookAt(center: vec3): this;
        setNear(near: number): this;
        setFar(far: number): this;
        genOtherMatrixs(): void;
        abstract compuseProjectionMatrix(): any;
        abstract deCompuseProjectionMatrix(): any;
        abstract setAspectRadio(radio: number): Camera;
    }
}
declare module "shader/Program" {
    import { mat4 } from "gl-matrix";
    import { Camera } from "cameras/Camera";
    import { DataType } from "DataTypeEnum";
    import { IDirtyable } from "Dirtyable";
    import { Material } from "materials/Material";
    import { Mesh } from "Mesh";
    import { Scene } from "Scene";
    import { Texture } from "textures/Texture";
    export interface IProgramSource {
        vertexShader: string;
        fragmentShader: string;
    }
    export interface IRenderParamHolder {
        hostObject?: object;
        defines?: {
            [index: string]: {
                defineName: string;
                useValue: boolean;
            };
        };
        defineLinks?: {
            [index: string]: string;
        };
        uniforms?: {
            [index: string]: IUniform;
        };
        uniformArrays?: {
            [index: string]: IUniformArray;
        };
        attributes?: {
            [index: string]: Attribute;
        };
        textures?: {
            [index: string]: {
                name?: string;
                source?: Texture;
            };
        };
        textureArrays?: {
            [index: string]: {
                name?: string;
                sources?: Texture[];
            };
        };
        prefix?: {
            [index: string]: {
                type: DataType;
                updator: (renderParam: IBuildinRenderParamMaps) => any;
            };
        };
        structArrays?: {
            [index: string]: {
                name?: string;
            };
        };
    }
    export interface IBuildinRenderParamMaps {
        mesh: Mesh;
        camera?: Camera;
        material?: Material;
        scene?: Scene;
    }
    export interface IRenderParamBase {
        name?: string;
        updator?: (param: IBuildinRenderParamMaps) => any;
    }
    export interface IUniform extends IRenderParamBase {
        type: DataType;
    }
    export interface IUniformArray extends IRenderParamBase {
        type: DataType;
    }
    export class Attribute {
        name?: string;
        size: number;
        data: number[];
        type: number;
        index: number;
        stride: number;
        buffer: WebGLBuffer;
        gl: WebGLRenderingContext;
        constructor(gl: WebGLRenderingContext, paramter: {
            type: number;
            size?: number;
            data?: number[];
            stride?: number;
        });
    }
    export class Program implements IDirtyable {
        gl: WebGLRenderingContext;
        enableDepthTest: boolean;
        enableStencilTest: boolean;
        dirty: boolean;
        webGlProgram: WebGLProgram;
        extensionStatements: string[];
        private defineCaches;
        private uniformCaches;
        private uniformArrayCaches;
        private undesiredUniforms;
        private attributeLocations;
        private undesiredAttributes;
        private defineLinks;
        private extraRenderParamHolders;
        private viewport;
        private vertexPrecision;
        private fragmentPrecision;
        private currentTextureUnit;
        private source;
        constructor(gl: WebGLRenderingContext, source: IProgramSource, holders: {
            [index: string]: IRenderParamHolder;
        });
        drawMode: (gl: WebGLRenderingContext) => number;
        setFragmentShader(fragmentShader: string): this;
        setVertexShader(vertexShader: string): this;
        setExtraRenderParam(name: string, paramHolder: IRenderParamHolder): this;
        setViewPort(viewport: {
            x: number;
            y: number;
            width: number;
            height: number;
        }): void;
        clean(): void;
        make(): this;
        pass(buildinContainers: IBuildinRenderParamMaps): this;
        private passOneParamsHolder(buildinContainder, holder, namePrefix?);
        private updateDefines(buildinContainers);
        private updateUniform(name, type, value);
        private updateUniformArray(name, type, value);
        private getAttribLocation(name);
    }
    export const shaderPassLib: {
        uniforms: {
            modelViewProjectionMatrix: {
                type: DataType;
                updator: (p: IBuildinRenderParamMaps) => mat4;
            };
            modelViewMatrix: {
                type: DataType;
                updator: ({mesh, camera}: {
                    mesh: any;
                    camera: any;
                }) => mat4;
            };
        };
    };
}
declare module "Decorators" {
    import { DataType } from "DataTypeEnum";
    import { IBuildinRenderParamMaps } from "shader/Program";
    export const RENDER_PARAM_HOLDER = "renderParams";
    export function uniform(type: DataType, name?: string): (proto: any, key: any) => void;
    export function bindUniformGetter(name: string, type: DataType, getter: (p: IBuildinRenderParamMaps) => any): (constructor: any) => void;
    export function uniformArray<DecoratorClass>(type: DataType, name?: string): (proto: any, key: any) => void;
    export function texture<DecoratorClass>(name?: string): (proto: any, key: any) => void;
    export function textureArray<DecoratorClass>(name?: string): (proto: any, key: any) => void;
    export function arrayOfStructures(name?: string): (proto: any, key: any) => void;
    export function define(defineName: string, useValue?: boolean): (proto: any, key: any) => void;
    export function ifdefine(defineName: string): (proto: any, key: any) => void;
    export function readyRequire<IAsyncResource>(proto: any, key: any): void;
}
declare module "Util" {
    export function mixin(toObject: {}, fromObject: {}): void;
    export function getDomScriptText(script: HTMLScriptElement): string;
}
declare module "geometries/CubeGeometry" {
    import { Geometry } from "geometries/Geometry";
    export class CubeGeometry extends Geometry {
        constructor(gl: WebGLRenderingContext);
    }
}
declare module "geometries/TileGeometry" {
    import { Geometry } from "geometries/Geometry";
    export class TileGeometry extends Geometry {
        private _widthSegments;
        private _heightSegments;
        private _width;
        private _height;
        constructor(gl: WebGLRenderingContext);
        build(): this;
    }
}
declare module "materials/SkyMaterial" {
    import { Program } from "shader/Program";
    import { CubeTexture } from "textures/CubeTexture";
    import { Material } from "materials/Material";
    export class SkyMaterial extends Material {
        cubeTexture: CubeTexture;
        constructor(gl: WebGLRenderingContext, cubeTexture: CubeTexture);
        protected initShader(gl: WebGLRenderingContext): Program;
    }
}
declare module "loader/obj_mtl/CommonPatterns" {
    export namespace patterns {
        const num: RegExp;
        const commentPattern: RegExp;
    }
}
declare module "loader/obj_mtl/ResourceFetcher" {
    export function fetchRes(url: string): Promise<{}>;
}
declare module "loader/obj_mtl/MTLLoader" {
    export class MTLLoader {
        static load(gl: WebGLRenderingContext, baseurl: string): Promise<{}>;
        protected static newmtlPattern: RegExp;
        protected static ambientPattern: RegExp;
        protected static diffusePattern: RegExp;
        protected static specularePattern: RegExp;
        protected static specularExponentPattern: RegExp;
        protected static trancparencyPattern: RegExp;
        protected static mapPattern: RegExp;
        protected static mapSinglePattern: RegExp;
        private static handleSingleLine(gl, home, line, materials, currentMaterial);
        private static getImageUrl(line);
        private static getVector(pattern, line);
        private static getNumber(pattern, line);
    }
}
declare module "loader/obj_mtl/OBJLoader" {
    import { Object3d } from "Object3d";
    export class OBJLoader {
        static load(gl: WebGLRenderingContext, url: string): Object3d;
        protected static faceSplitVertPattern: RegExp;
        protected static facePerVertPattern: RegExp;
        protected static objectSplitPattern: RegExp;
        protected static mtlLibPattern: RegExp;
        protected static useMTLPattern: RegExp;
        protected static mtlLibSinglePattern: RegExp;
        protected static useMTLSinglePattern: RegExp;
        protected static vertexPattern: RegExp;
        protected static uvPattern: RegExp;
        protected static normalPattern: RegExp;
        protected static indexPattern: RegExp;
        protected static praiseAttibuteLines(lines: any): number[][];
        protected static parseAsTriangle(faces: string[], forEachFace: (face: string[]) => void): void;
        protected static buildUpMeshes(gl: WebGLRenderingContext, container: Object3d, content: string, materials: any, unIndexedPositions: number[][], unIndexedUVs: number[][], unIndexedNormals: number[][]): void;
    }
}
declare module "extensions/Water" {
    import { Mesh } from "Mesh";
    export class Water extends Mesh {
        constructor(gl: WebGLRenderingContext);
    }
}
declare module "CanvasToy" {
    export { ifdefine, texture, textureArray, uniform, uniformArray } from "Decorators";
    export { IAsyncResource } from "IAsyncResource";
    export { Renderer } from "renderer/Renderer";
    export { FrameBuffer, Attachment, AttachmentType } from "renderer/FrameBuffer";
    export { Object3d } from "Object3d";
    export { Scene } from "Scene";
    export { DataType } from "DataTypeEnum";
    export * from "Util";
    export { Camera } from "cameras/Camera";
    export { PerspectiveCamera } from "cameras/PerspectiveCamera";
    export { OrthoCamera } from "cameras/OrthoCamera";
    export { Geometry } from "geometries/Geometry";
    export { CubeGeometry } from "geometries/CubeGeometry";
    export { RectGeometry } from "geometries/RectGeometry";
    export { SphereGeometry } from "geometries/SphereGeometry";
    export { TileGeometry } from "geometries/TileGeometry";
    export { Texture } from "textures/Texture";
    export { Texture2D } from "textures/Texture2D";
    export { CubeTexture } from "textures/CubeTexture";
    export { DataTexture } from "textures/DataTexture";
    export { Material } from "materials/Material";
    export { StandardMaterial } from "materials/StandardMaterial";
    export { SkyMaterial } from "materials/SkyMaterial";
    export { LinearDepthPackMaterial } from "materials/ESM/DepthPackMaterial";
    export { Light } from "lights/Light";
    export { PointLight } from "lights/PointLight";
    export { SpotLight } from "lights/SpotLight";
    export { DirectionalLight } from "lights/DirectionalLight";
    export { ShadowType } from "lights/ShadowType";
    export { OBJLoader } from "loader/obj_mtl/OBJLoader";
    export { Mesh } from "Mesh";
    export { Water } from "extensions/Water";
}
declare module "cameras/CubeCamera" {
    import { PerspectiveCamera } from "cameras/PerspectiveCamera";
    export class CubeCamera extends PerspectiveCamera {
        private _projectionMatrices;
        constructor();
        compuseProjectionMatrix(): void;
        deCompuseProjectionMatrix(): void;
    }
}
