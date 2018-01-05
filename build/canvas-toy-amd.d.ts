/// <reference types="webgl-ext" />
/// <reference types="gl-matrix" />
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
declare module "Dirtyable" {
    export interface IDirtyable {
        clean(...args: any[]): any;
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
        protected _ratio: number;
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
        changeZoom(offset: number): this;
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
declare module "textures/Texture" {
    import { IAsyncResource } from "IAsyncResource";
    export class Texture implements IAsyncResource {
        protected _glTexture: WebGLTexture;
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
        readonly glTexture: WebGLTexture;
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
        setAsyncFinished(promise: Promise<Texture>): this;
        asyncFinished(): Promise<Texture>;
        apply(gl: WebGLRenderingContext): this;
        applyForRendering(gl: WebGLRenderingContext, width: number, height: number): this;
    }
}
declare module "textures/Texture2D" {
    import { Texture } from "textures/Texture";
    export class Texture2D extends Texture {
        constructor(gl: WebGLRenderingContext, url?: string);
        apply(gl: WebGLRenderingContext): this;
    }
}
declare module "shader/Attibute" {
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
}
declare module "geometries/Geometry" {
    import { IDirtyable } from "Dirtyable";
    import { Attribute } from "shader/Attibute";
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
        textureTargetCode: number;
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
        asRenderBuffer(gl: WebGLRenderingContext): this;
        asTargetTexture(texture: Texture, targetcode: any): this;
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
        protected gl: WebGLRenderingContext;
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
declare module "shader/shaders" {
    export namespace ShaderSource {
        const calculators__blinn_phong_glsl = "\nvec3 calculateLight(\n\n    vec3 position,\n\n    vec3 normal,\n\n    vec3 lightDir,\n\n    vec3 eyePos,\n\n    vec3 specular,\n\n    vec3 diffuse,\n\n    float shiness,\n\n    float idensity\n\n    ) {\n\n    float lambortian = max(dot(lightDir, normal), 0.0);\n\n    vec3 viewDir = normalize(eyePos - position);\n\n\n\n    // replace R * V with N * H\n\n    vec3 H = (lightDir + viewDir) / length(lightDir + viewDir);\n\n    float specularAngle = max(dot(H, normal), 0.0);\n\n\n\n    vec3 specularColor = specular * pow(specularAngle, shiness);\n\n    vec3 diffuseColor = diffuse * lambortian;\n\n    vec3 color = (diffuseColor + specularColor) * idensity;\n\n    return color;\n\n}\n\n";
        const calculators__blur__gaussian_glsl = "\nvec4 gaussian_blur(sampler2D origin, vec2 uv, float blurStep, vec2 blurDir) {\n\n    vec4 average = vec4(0.0, 0.0, 0.0, 0.0);\n\n    average += texture2D(origin, uv - 4.0 * blurStep * blurDir) * 0.0162162162;\n\n    average += texture2D(origin, uv - 3.0 * blurStep * blurDir) * 0.0540540541;\n\n    average += texture2D(origin, uv - 2.0 * blurStep * blurDir) * 0.1216216216;\n\n    average += texture2D(origin, uv - 1.0 * blurStep * blurDir) * 0.1945945946;\n\n    average += texture2D(origin, uv) * 0.2270270270;\n\n    average += texture2D(origin, uv + 1.0 * blurStep * blurDir) * 0.1945945946;\n\n    average += texture2D(origin, uv + 2.0 * blurStep * blurDir) * 0.1216216216;\n\n    average += texture2D(origin, uv + 3.0 * blurStep * blurDir) * 0.0540540541;\n\n    average += texture2D(origin, uv + 4.0 * blurStep * blurDir) * 0.0162162162;\n\n    return average;\n\n}\n\n";
        const calculators__blur__gaussian_log_glsl = "\n\n\n";
        const calculators__linearlize_depth_glsl = "\nfloat linearlizeDepth(float far, float near, float depth) {\n\n    float NDRDepth = depth * 2.0 - 1.0;;\n\n    return 2.0 * near / (near + far - NDRDepth * (far - near));\n\n}\n\n";
        const calculators__packFloat1x32_glsl = "\nvec4 packFloat1x32(float val)\n\n{\n\n    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;\n\n    pack = fract(pack);\n\n    pack -= vec4(pack.yzw / 255.0, 0.0);\n\n    return pack;\n\n}\n\n";
        const calculators__phong_glsl = "\nvec3 calculateLight(\n\n    vec3 position,\n\n    vec3 normal,\n\n    vec3 lightDir,\n\n    vec3 eyePos,\n\n    vec3 specularLight,\n\n    vec3 diffuseLight,\n\n    float shiness,\n\n    float idensity\n\n    ) {\n\n    float lambortian = max(dot(lightDir, normal), 0.0);\n\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n\n    vec3 viewDir = normalize(eyePos - position);\n\n    float specularAngle = max(dot(reflectDir, viewDir), 0.0);\n\n    vec3 specularColor = specularLight * pow(specularAngle, shiness);\n\n    vec3 diffuseColor = diffuse * lambortian;\n\n    return (diffuseColor + specularColor) * idensity;\n\n}\n\n";
        const calculators__shadow_factor_glsl = "\n#ifdef RECEIVE_SHADOW\n\n\n\nvec4 texture2DbilinearEXP(sampler2D shadowMap, vec2 uv, float texelSize) {\n\n    vec2 f = fract(uv / texelSize - 0.5);\n\n    vec2 centroidUV = (floor(uv / texelSize - 0.5)) * texelSize;\n\n\n\n    vec4 lb = texture2D(shadowMap, centroidUV + texelSize * vec2(0.0, 0.0));\n\n    vec4 lt = texture2D(shadowMap, centroidUV + texelSize * vec2(0.0, 1.0));\n\n    vec4 rb = texture2D(shadowMap, centroidUV + texelSize * vec2(1.0, 0.0));\n\n    vec4 rt = texture2D(shadowMap, centroidUV + texelSize * vec2(1.0, 1.0));\n\n    vec4 a = lb + log(mix(vec4(1.0), exp(lt - lb), f.y));\n\n    vec4 b = rb + log(mix(vec4(1.0), exp(rt - rb), f.y));\n\n    vec4 z = a + log(mix(vec4(1.0), exp(b - a), f.x));\n\n    return z;\n\n}\n\n\n\nvec4 texture2Dbilinear(sampler2D shadowMap, vec2 uv, float texelSize) {\n\n    vec2 f = fract(uv / texelSize - 0.5);\n\n    vec2 centroidUV = (floor(uv / texelSize - 0.5)) * texelSize;\n\n\n\n    vec4 lb = texture2D(shadowMap, centroidUV + texelSize * vec2(0.0, 0.0));\n\n    vec4 lt = texture2D(shadowMap, centroidUV + texelSize * vec2(0.0, 1.0));\n\n    vec4 rb = texture2D(shadowMap, centroidUV + texelSize * vec2(1.0, 0.0));\n\n    vec4 rt = texture2D(shadowMap, centroidUV + texelSize * vec2(1.0, 1.0));\n\n    vec4 a = mix(lb, lt, f.y);\n\n    vec4 b = mix(rb, rt, f.y);\n\n    vec4 z = mix(a, b, f.x);\n\n    return z;\n\n}\n\n\n\nfloat texture2Dfilter(sampler2D shadowMap, vec2 uv, float texelSize) {\n\n    vec2 info = texture2Dbilinear(shadowMap, uv, texelSize).xy;\n\n    float base = info.r;\n\n    float kernelSize = info.g;\n\n    float sum = 0.0;\n\n    for (int i = 0; i < FILTER_SIZE; ++i) {\n\n        for (int j = 0; j < FILTER_SIZE; ++j) {\n\n            vec2 subuv = uv + vec2(float(i) + 0.5 - float(FILTER_SIZE) / 2.0, float(j) + 0.5 - float(FILTER_SIZE) / 2.0) * texelSize * kernelSize;\n\n            float z = texture2Dbilinear(shadowMap, subuv, texelSize).r;\n\n            float expd = exp(z - base);\n\n            sum += expd;\n\n        }\n\n    }\n\n    sum /= float(FILTER_SIZE * FILTER_SIZE);\n\n    return base + log(sum);\n\n}\n\n\n\nfloat pcf(sampler2D shadowMap, vec2 uv, float depth, float bias, float texelSize) {\n\n    vec2 info = texture2Dbilinear(shadowMap, uv, texelSize).xy;\n\n    float kernelSize = 1.0;\n\n    float sum = 0.0;\n\n    for (int i = 0; i < FILTER_SIZE; ++i) {\n\n        for (int j = 0; j < FILTER_SIZE; ++j) {\n\n            float z = texture2Dbilinear(shadowMap, uv + kernelSize * vec2(float(i) + 0.5 - float(FILTER_SIZE) / 2.0, float(j) + 0.5 - float(FILTER_SIZE) / 2.0).x * texelSize, texelSize).r;\n\n            sum += step(depth - bias, z) / float(FILTER_SIZE * FILTER_SIZE);\n\n        }\n\n    }\n\n    return sum;\n\n}\n\n\n\nfloat getSpotDirectionShadow(vec2 clipPos, sampler2D shadowMap, float linearDepth, float lambertian, float texelSize, int shadowLevel, float softness)\n\n{\n\n    if (shadowLevel == SHADOW_LEVEL_NONE) {\n\n        return 1.0;\n\n    } else {\n\n        vec2 uv = clipPos * 0.5 + 0.5;\n\n        float bias = clamp(0.2 * tan(acos(lambertian)), 0.0, 1.0);\n\n        if (shadowLevel == SHADOW_LEVEL_HARD) {\n\n            return step(linearDepth, texture2D(shadowMap, uv).r + bias);\n\n        } else {\n\n            float z = texture2DbilinearEXP(shadowMap, uv, texelSize).r;\n\n            float s = exp(z - linearDepth * softness);\n\n            return min(s, 1.0);\n\n        }\n\n    }\n\n}\n\n\n\nfloat getPointShadow(vec3 cubePos, samplerCube shadowMap, float linearDepth, float lambertian, float texelSize, int shadowLevel, float softness)\n\n{\n\n    float bias = clamp(0.2 * tan(acos(lambertian)), 0.0, 1.0);\n\n    if (shadowLevel == SHADOW_LEVEL_NONE) {\n\n        return 1.0;\n\n    } else {\n\n        // if (shadowLevel == SHADOW_LEVEL_HARD) {\n\n            return step(linearDepth, textureCube(shadowMap, cubePos).r + bias);\n\n        //else {\n\n            // TODO: perform cubemap interpolation for soft-level shadow map for point light\n\n        //}\n\n    }\n\n}\n\n\n\n#endif\n\n";
        const calculators__types_glsl = "\nvec3 calculateDirLight(\n\n    DirectLight light,\n\n    vec3 materialDiff,\n\n    vec3 materialSpec,\n\n    float materialSpecExp,\n\n    vec3 position,\n\n    vec3 normal,\n\n    vec3 eyePos\n\n    ) {\n\n    return calculateLight(\n\n        position,\n\n        normal,\n\n        -light.direction,\n\n        eyePos,\n\n        light.color * materialSpec,\n\n        light.color * materialDiff,\n\n        materialSpecExp,\n\n        light.idensity\n\n    );\n\n}\n\n\n\nvec3 calculatePointLight(\n\n    PointLight light,\n\n    vec3 materialDiff,\n\n    vec3 materialSpec,\n\n    float materialSpecExp,\n\n    vec3 position,\n\n    vec3 normal,\n\n    vec3 eyePos\n\n    ) {\n\n    float lightDis = length(light.position - position);\n\n    lightDis /= light.radius;\n\n    float atten_min = 1.0 / (light.constantAtten + light.linearAtten + light.squareAtten);\n\n    float atten_max = 1.0 / light.constantAtten;\n\n    float atten = 1.0 / (light.constantAtten + light.linearAtten * lightDis + light.squareAtten * lightDis * lightDis);\n\n    float idensity = light.idensity * (atten - atten_min) / (atten_max - atten_min);\n\n    idensity *= step(lightDis, 1.0);\n\n    return calculateLight(\n\n        position,\n\n        normal,\n\n        normalize(light.position - position),\n\n        eyePos,\n\n        light.color * materialSpec,\n\n        light.color * materialDiff,\n\n        materialSpecExp,\n\n        idensity\n\n    );\n\n}\n\n\n\nvec3 calculateSpotLight(\n\n    SpotLight light,\n\n    vec3 materialDiff,\n\n    vec3 materialSpec,\n\n    float materialSpecExp,\n\n    vec3 position,\n\n    vec3 normal,\n\n    vec3 eyePos\n\n    ) {\n\n    vec3 lightDir = normalize(light.position - position);\n\n    float spotFactor = dot(-lightDir, light.spotDir);\n\n    if (spotFactor < light.coneAngleCos) {\n\n        return vec3(0.0);\n\n    }\n\n    float lightDis = length(light.position - position);\n\n    lightDis /= light.radius;\n\n    float atten_min = 1.0 / (light.constantAtten + light.linearAtten + light.squareAtten);\n\n    float atten_max = 1.0 / light.constantAtten;\n\n    float atten = 1.0 / (light.constantAtten + light.linearAtten * lightDis + light.squareAtten * lightDis * lightDis);\n\n    float idensity = light.idensity * (atten - atten_min) / (atten_max - atten_min);\n\n    \n\n    idensity *= (spotFactor - light.coneAngleCos) / (1.0 - light.coneAngleCos);\n\n    // idensity *= step(light.radius, lightDis);\n\n    return calculateLight(\n\n        position,\n\n        normal,\n\n        lightDir,\n\n        eyePos,\n\n        light.color * materialSpec,\n\n        light.color * materialDiff,\n\n        materialSpecExp,\n\n        idensity\n\n    );\n\n}\n\n\n\n// float directAndSpotShadow(sampler2D shadowMap, vec4 shadowCoord) {\n\n//\n\n// }\n\n";
        const calculators__unpackFloat1x32_glsl = "\nfloat unpackFloat1x32( vec4 rgba ) {\n\n  return dot( rgba, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 160581375.0) );\n\n}\n\n";
        const debug__checkBox_glsl = "\nfloat checkerBoard(in vec2 uv, in float subSize) {\n\n    vec2 bigBox = mod(uv, vec2(subSize * 2.0));\n\n    return (\n\n        step(subSize, bigBox.x) * step(subSize, bigBox.y)\n\n        + step(subSize, subSize * 2.0 -bigBox.x) * step(subSize, subSize * 2.0 -bigBox.y)\n\n    );\n\n}\n\n";
        const definitions__light_glsl = "\n#define SHADOW_LEVEL_NONE 0\n\n#define SHADOW_LEVEL_HARD 1\n\n#define SHADOW_LEVEL_SOFT 2\n\n#define SHADOW_LEVEL_PCSS 3\n\n\n\nstruct DirectLight\n\n{\n\n    vec3 color;\n\n    float idensity;\n\n    vec3 direction;\n\n#ifdef RECEIVE_SHADOW\n\n    lowp int shadowLevel;\n\n    float softness;\n\n    float shadowMapSize;\n\n    mat4 projectionMatrix;\n\n    mat4 viewMatrix;\n\n#endif\n\n};\n\n\n\nstruct PointLight {\n\n    vec3 color;\n\n    float idensity;\n\n    float radius;\n\n    vec3 position;\n\n    float squareAtten;\n\n    float linearAtten;\n\n    float constantAtten;\n\n#ifdef RECEIVE_SHADOW\n\n    lowp int shadowLevel;\n\n    float softness;\n\n    float shadowMapSize;\n\n    mat4 projectionMatrix;\n\n    mat4 viewMatrix;\n\n    float pcssArea;\n\n#endif\n\n};\n\n\n\nstruct SpotLight {\n\n    vec3 color;\n\n    float idensity;\n\n    float radius;\n\n    vec3 position;\n\n    float squareAtten;\n\n    float linearAtten;\n\n    float constantAtten;\n\n    float coneAngleCos;\n\n    vec3 spotDir;\n\n#ifdef RECEIVE_SHADOW\n\n    lowp int shadowLevel;\n\n    float softness;\n\n    float shadowMapSize;\n\n    mat4 projectionMatrix;\n\n    mat4 viewMatrix;\n\n    float pcssArea;\n\n#endif\n\n};\n\n";
        const interploters__deferred__geometry_frag = "\nuniform vec3 ambient;\n\nuniform vec3 uMaterialDiff;\n\nuniform vec3 uMaterialSpec;\n\nuniform float uMaterialSpecExp;\n\n\n\nuniform vec3 eyePos;\n\nvarying vec3 vNormal;\n\n\n\n#ifdef _MAIN_TEXTURE\n\nuniform sampler2D uMainTexture;\n\nvarying vec2 vMainUV;\n\n#endif\n\n\n\n#ifdef _NORMAL_TEXTURE\n\nuniform sampler2D uNormalTexture;\n\nvarying vec2 vNormalUV;\n\n#endif\n\n\n\nvec2 encodeNormal(vec3 n) {\n\n    return normalize(n.xy) * (sqrt(n.z*0.5+0.5));\n\n}\n\n\n\nvoid main () {\n\n    vec3 normal = normalize(vNormal);\n\n    float specular = (uMaterialSpec.x + uMaterialSpec.y + uMaterialSpec.z) / 3.0;\n\n#ifdef _NORMAL_TEXTURE\n\n    gl_FragData[0] = vec4(encodeNormal(normal), gl_FragCoord.z, uMaterialSpecExp);\n\n#else\n\n    gl_FragData[0] = vec4(encodeNormal(normal), gl_FragCoord.z, uMaterialSpecExp);\n\n#endif\n\n#ifdef _MAIN_TEXTURE\n\n    gl_FragData[1] = vec4(uMaterialDiff * texture2D(uMainTexture, vMainUV).xyz, specular);\n\n#else\n\n    gl_FragData[1] = vec4(uMaterialDiff, specular);\n\n#endif\n\n}\n\n";
        const interploters__deferred__geometry_vert = "\nattribute vec3 position;\n\nuniform mat4 modelViewProjectionMatrix;\n\n\n\n#ifdef _MAIN_TEXTURE\n\nattribute vec2 aMainUV;\n\nvarying vec2 vMainUV;\n\n#endif\n\n\n\nuniform mat4 normalViewMatrix;\n\nattribute vec3 aNormal;\n\nvarying vec3 vNormal;\n\n\n\nvoid main (){\n\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n\n    vNormal = (normalViewMatrix * vec4(aNormal, 1.0)).xyz;\n\n\n\n#ifdef _MAIN_TEXTURE\n\n    vMainUV = aMainUV;\n\n#endif\n\n}\n\n";
        const interploters__deferred__tiledLight_frag = "\n#define MAX_TILE_LIGHT_NUM 32\n\n\n\nprecision highp float;\n\n\n\nuniform float uHorizontalTileNum;\n\nuniform float uVerticalTileNum;\n\nuniform float uLightListLengthSqrt;\n\n\n\nuniform mat4 inverseProjection;\n\n\n\nuniform sampler2D uLightIndex;\n\nuniform sampler2D uLightOffsetCount;\n\nuniform sampler2D uLightPositionRadius;\n\nuniform sampler2D uLightColorIdensity;\n\n\n\nuniform sampler2D uNormalDepthSE;\n\nuniform sampler2D uDiffSpec;\n\n\n\nuniform float cameraNear;\n\nuniform float cameraFar;\n\n\n\n\n\nvarying vec3 vPosition;\n\n\n\nvec3 decodeNormal(vec2 n)\n\n{\n\n   vec3 normal;\n\n   normal.z = dot(n, n) * 2.0 - 1.0;\n\n   normal.xy = normalize(n) * sqrt(1.0 - normal.z * normal.z);\n\n   return normal;\n\n}\n\n\n\nvec3 decodePosition(float depth) {\n\n    vec4 clipSpace = vec4(vPosition.xy, depth * 2.0 - 1.0, 1.0);\n\n    vec4 homogenous = inverseProjection * clipSpace;\n\n    return homogenous.xyz / homogenous.w;\n\n}\n\n\n\nvoid main() {\n\n    vec2 uv = vPosition.xy * 0.5 + vec2(0.5);\n\n    vec2 gridIndex = uv ;// floor(uv * vec2(uHorizontalTileNum, uVerticalTileNum)) / vec2(uHorizontalTileNum, uVerticalTileNum);\n\n    vec4 lightIndexInfo = texture2D(uLightOffsetCount, gridIndex);\n\n    float lightStartIndex = lightIndexInfo.r;\n\n    float lightNum = lightIndexInfo.w;\n\n    vec4 tex1 = texture2D(uNormalDepthSE, uv);\n\n    vec4 tex2 = texture2D(uDiffSpec, uv);\n\n\n\n    vec3 materialDiff = tex2.xyz;\n\n    vec3 materialSpec = vec3(tex2.w);\n\n    float materialSpecExp = tex1.w;\n\n\n\n    vec3 normal = decodeNormal(tex1.xy);\n\n    vec3 viewPosition = decodePosition(tex1.z);\n\n    vec3 totalColor = vec3(0.0);\n\n    int realCount = 0;\n\n    for(int i = 0; i < MAX_TILE_LIGHT_NUM; i++) {\n\n        if (float(i) > lightNum - 0.5) {\n\n            break;\n\n        }\n\n        // float listX = (float(lightStartIndex + i) - listX_int * uLightListLengthSqrt) / uLightListLengthSqrt;\n\n        // float listY = ((lightStartIndex + i) / uLightListLengthSqrt) / uLightListLengthSqrt;\n\n        // float listX = (mod(lightStartIndex + i, uLightListLengthSqrt)) / uLightListLengthSqrt;\n\n        // listX = 1.0;\n\n        // listY = 0.0;\n\n        float fixlightId = texture2D(uLightIndex, vec2((lightStartIndex + float(i)) / uLightListLengthSqrt, 0.5)).x;\n\n        vec4 lightPosR = texture2D(uLightPositionRadius, vec2(fixlightId, 0.5));\n\n        vec3 lightPos = lightPosR.xyz;\n\n        float lightR = lightPosR.w;\n\n        vec4 lightColorIden = texture2D(uLightColorIdensity, vec2(fixlightId, 0.5));\n\n        vec3 lightColor = lightColorIden.xyz;\n\n        float lightIdensity = lightColorIden.w;\n\n\n\n        float dist = distance(lightPos, viewPosition);\n\n        if (dist < lightR) {\n\n            realCount++;\n\n            vec3 fixLightColor = lightColor * min(1.0,  1.0 / (dist * dist ) / (lightR * lightR));\n\n            totalColor += calculateLight(\n\n                viewPosition,\n\n                normal,\n\n                normalize(lightPos - viewPosition),\n\n                vec3(0.0),\n\n                materialSpec * lightColor,\n\n                materialDiff * lightColor,\n\n                materialSpecExp,\n\n                lightIdensity\n\n            );\n\n            // totalColor += vec3(listX, listY, 0.0);\n\n        }\n\n            // vec3 lightDir = normalize(lightPos - viewPosition);\n\n            // vec3 reflectDir = normalize(reflect(lightDir, normal));\n\n            // vec3 viewDir = normalize( - viewPosition);\n\n            // vec3 H = normalize(lightDir + viewDir);\n\n            // float specularAngle = max(dot(H, normal), 0.0);\n\n            // // vec3 specularColor = materialSpec * pow(specularAngle, materialSpecExp);\n\n        // totalColor = vec3(float(lightStartIndex) / uLightListLengthSqrt / uLightListLengthSqrt);\n\n        //}\n\n        //}\n\n    }\n\n    // vec3 depth = vec3(linearlizeDepth(cameraFar, cameraNear, tex1.z));\n\n    // vec3 depth = vec3(tex1.z);\n\n    vec3 test = vec3(float(realCount) / 32.0);\n\n    gl_FragColor = vec4(totalColor, 1.0);\n\n}\n\n";
        const interploters__deferred__tiledLight_vert = "\nattribute vec3 position;\n\nvarying vec3 vPosition;\n\n\n\nvoid main()\n\n{\n\n    gl_Position = vec4(position, 1.0);\n\n    vPosition = position;\n\n}\n\n";
        const interploters__forward__esm__depth_frag = "\nuniform float softness;\n\nvarying vec3 viewPos;\n\n\n\nvoid main () {\n\n    float d = length(viewPos);\n\n    gl_FragColor.r = d * softness;\n\n    gl_FragColor.g = exp(d) * d;\n\n}\n\n";
        const interploters__forward__esm__depth_vert = "\nattribute vec3 position;\n\nuniform mat4 modelViewProjectionMatrix;\n\nuniform mat4 modelViewMatrix;\n\nvarying vec3 viewPos;\n\n\n\nvoid main () {\n\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n\n    viewPos = (modelViewMatrix * vec4(position, 1.0)).xyz;\n\n}\n\n";
        const interploters__forward__esm__prefiltering_frag = "\nuniform sampler2D uOrigin;\n\nuniform vec2 uBlurDir;\n\nuniform float uBlurStep;\n\n\n\nuniform float lightArea;\n\n\n\nvarying vec2 uv;\n\n\n\nvoid main () {\n\n    float base = texture2D(uOrigin, uv).r;\n\n    float block = 0.0;\n\n\n\n    for (int i = 0; i < BLOCK_SIZE; ++i) {\n\n        for (int j = 0; j < BLOCK_SIZE; ++j) {\n\n            float d = texture2D(uOrigin, uv + vec2(float(i - BLOCK_SIZE / 2) + 0.5, float(j - BLOCK_SIZE / 2) + 0.5) * uBlurStep).r;\n\n            block += step(base, d) * d / float(BLOCK_SIZE * BLOCK_SIZE);\n\n        }\n\n    }\n\n    \n\n    float kenelSize = min(4.0, lightArea * (base - block) / base);\n\n    float stepSize = kenelSize / float(FILTER_SIZE);\n\n\n\n    float sum = 0.0;\n\n\n\n    for (int i = 0; i < FILTER_SIZE; ++i) {\n\n        for (int j = 0; j < FILTER_SIZE; ++j) {\n\n            float d = texture2D(uOrigin, \n\n            uv + stepSize * vec2(float(i - FILTER_SIZE / 2) + 0.5, float(j - FILTER_SIZE / 2) + 0.5) * uBlurStep).r;\n\n            sum += exp(d - base) / float(FILTER_SIZE * FILTER_SIZE);\n\n        }\n\n    }\n\n\n\n    float average = log(sum) + base;\n\n\n\n    gl_FragColor.r = average;\n\n    gl_FragColor.g = kenelSize;\n\n}\n\n";
        const interploters__forward__esm__prefiltering_vert = "\nuniform mat4 normalMatrix;\n\nattribute vec3 position;\n\nattribute vec3 normal;\n\nvarying vec2 uv;\n\nvarying vec3 vNormal;\n\n\n\nvoid main () {\n\n    gl_Position = vec4(position, 1.0);\n\n    uv = gl_Position.xy * 0.5 + 0.5;\n\n    vNormal = normalize((normalMatrix * vec4(normal, 1.0)).xyz);\n\n}\n\n";
        const interploters__forward__gouraud_frag = "\nattribute vec3 position;\n\nuniform mat4 modelViewProjectionMatrix;\n\n\n\nvoid main() {\n\n    textureColor = colorOrMainTexture(vMainUV);\n\n#ifdef OPEN_LIGHT\n\n    totalLighting = ambient;\n\n    vec3 normal = normalize(vNormal);\n\n    gl_FragColor = vec4(totalLighting, 1.0);\n\n#else\n\n#ifdef USE_COLOR\n\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\n#endif\n\n#endif\n\n#ifdef _MAIN_TEXTURE\n\n    gl_FragColor = gl_FragColor * textureColor;\n\n#endif\n\n#ifdef USE_COLOR\n\n    gl_FragColor = gl_FragColor * color;\n\n#endif\n\n}\n\n";
        const interploters__forward__gouraud_vert = "\nattribute vec3 position;\n\nuniform mat4 modelViewProjectionMatrix;\n\n\n\nattribute vec2 aMainUV;\n\nvarying vec2 vMainUV;\n\n\n\nvoid main (){\n\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n\n#ifdef OPEN_LIGHT\n\n    vec3 normal = (normalMatrix * vec4(aNormal, 0.0)).xyz;\n\n    totalLighting = ambient;\n\n    normal = normalize(normal);\n\n    for (int index = 0; index < LIGHT_NUM; index++) {\n\n        totalLighting += calculate_light(gl_Position, normal, lights[index].position, eyePos, lights[index].specular, lights[index].diffuse, 4, lights[index].idensity);\n\n    }\n\n    vLightColor = totalLighting;\n\n#endif\n\n#ifdef _MAIN_TEXTURE\n\n    vTextureCoord = aTextureCoord;\n\n#endif\n\n}\n\n";
        const interploters__forward__phong_frag = "\nuniform vec3 ambient;\n\nuniform vec3 uMaterialSpec;\n\nuniform float uMaterialSpecExp;\n\nuniform vec3 uMaterialDiff;\n\n\n\nuniform vec3 cameraPos;\n\n\n\nvarying vec2 vMainUV;\n\nvarying vec4 clipPos;\n\n\n\nvarying vec3 vNormal;\n\nvarying vec3 vPosition;\n\n\n\n#ifdef _MAIN_TEXTURE\n\nuniform sampler2D uMainTexture;\n\n#endif\n\n\n\n#ifdef _ENVIRONMENT_MAP\n\nuniform float reflectivity;\n\nuniform samplerCube uCubeTexture;\n\n#endif\n\n\n\n#if (directLightsNum > 0)\n\nuniform DirectLight directLights[directLightsNum];\n\nuniform sampler2D directLightShadowMap[directLightsNum];\n\n#endif\n\n\n\n#if (pointLightsNum > 0)\n\nuniform PointLight pointLights[pointLightsNum];\n\nuniform samplerCube pointLightShadowMap[pointLightsNum];\n\n#endif\n\n\n\n#if (spotLightsNum > 0)\n\nuniform SpotLight spotLights[spotLightsNum];\n\nuniform sampler2D spotLightShadowMap[spotLightsNum];\n\n#endif\n\n\n\n#ifdef RECEIVE_SHADOW\n\n\n\n    #if (directLightsNum > 0)\n\n    varying vec4 directShadowCoord[directLightsNum];\n\n    varying float directLightDepth[directLightsNum];\n\n    #endif\n\n\n\n    #if (spotLightsNum > 0)\n\n    varying vec4 spotShadowCoord[spotLightsNum];\n\n    varying float spotLightDepth[spotLightsNum];\n\n    #endif\n\n\n\n#endif\n\n\n\nvoid main () {\n\n\n\n#ifdef _MAIN_TEXTURE\n\n    gl_FragColor = texture2D(uMainTexture, vMainUV);\n\n#else\n\n    #ifdef _DEBUG\n\n    gl_FragColor = vec4(vec3(checkerBoard(vMainUV, 0.1)), 1.0);\n\n    #else\n\n    gl_FragColor = vec4(1.0);\n\n    #endif\n\n#endif\n\n    vec3 color = vec3(0.0);\n\n    vec3 normal = normalize(vNormal);\n\n    vec3 totalLighting = ambient;\n\n    #ifdef _ENVIRONMENT_MAP\n\n    vec3 viewDir = normalize(-vPosition);\n\n    vec3 skyUV = reflect(viewDir, vNormal);\n\n    totalLighting = mix(totalLighting, textureCube(uCubeTexture, skyUV).xyz, reflectivity);\n\n    #endif\n\n#if (directLightsNum > 0)\n\n    for (int index = 0; index < directLightsNum; index++) {\n\n        vec3 lighting = calculateDirLight(\n\n            directLights[index],\n\n            uMaterialDiff,\n\n            uMaterialSpec,\n\n            uMaterialSpecExp,\n\n            vPosition,\n\n            normal,\n\n            cameraPos\n\n        );\n\n    #ifdef RECEIVE_SHADOW\n\n        float lambertian = dot(-directLights[index].direction, normal);\n\n        float shadowFactor = getSpotDirectionShadow(\n\n            directShadowCoord[index].xy / directShadowCoord[index].w, \n\n            directLightShadowMap[index], \n\n            directLightDepth[index], \n\n            lambertian, \n\n            1.0 / directLights[index].shadowMapSize,\n\n            directLights[index].shadowLevel,\n\n            directLights[index].softness\n\n        );\n\n        lighting *= shadowFactor;\n\n    #endif\n\n        totalLighting += lighting;\n\n    }\n\n#endif\n\n#if (pointLightsNum > 0)\n\n    for (int index = 0; index < pointLightsNum; index++) {\n\n        vec3 lighting = calculatePointLight(\n\n            pointLights[index],\n\n            uMaterialDiff,\n\n            uMaterialSpec,\n\n            uMaterialSpecExp,\n\n            vPosition,\n\n            normal,\n\n            cameraPos\n\n        );\n\n        #ifdef RECEIVE_SHADOW\n\n        vec3 offset = vPosition - pointLights[index].position;\n\n        vec3 cubePos = normalize(offset);\n\n        float linearDepth = length(offset);\n\n        float lambertian = max(dot(-cubePos, normal), 0.0);\n\n        float shadowFactor = getPointShadow(\n\n            cubePos,\n\n            pointLightShadowMap[index],\n\n            linearDepth,\n\n            lambertian,\n\n            1.0 / pointLights[index].shadowMapSize,\n\n            pointLights[index].shadowLevel,\n\n            pointLights[index].softness\n\n        );\n\n        lighting *= shadowFactor;\n\n        #endif\n\n        totalLighting += lighting;\n\n    }\n\n#endif\n\n#if (spotLightsNum > 0)\n\n    for (int index = 0; index < spotLightsNum; index++) {\n\n        vec3 lighting = calculateSpotLight(\n\n            spotLights[index],\n\n            uMaterialDiff,\n\n            uMaterialSpec,\n\n            uMaterialSpecExp,\n\n            vPosition,\n\n            normal,\n\n            cameraPos\n\n        );\n\n    #ifdef RECEIVE_SHADOW\n\n        float lambertian = dot(-spotLights[index].spotDir, normal);\n\n        float shadowFactor = getSpotDirectionShadow(\n\n            spotShadowCoord[index].xy / spotShadowCoord[index].w, \n\n            spotLightShadowMap[index],\n\n            spotLightDepth[index], \n\n            lambertian, \n\n            1.0 / spotLights[index].shadowMapSize,\n\n            spotLights[index].shadowLevel,\n\n            spotLights[index].softness\n\n        );\n\n        lighting *= shadowFactor;\n\n    #endif\n\n        totalLighting += lighting;\n\n\n\n    }\n\n#endif\n\n    color += totalLighting;\n\n    gl_FragColor *= vec4(color, 1.0);\n\n}\n\n";
        const interploters__forward__phong_vert = "\nattribute vec3 position;\n\nuniform mat4 modelViewProjectionMatrix;\n\nuniform mat4 modelMatrix;\n\n\n\nattribute vec2 aMainUV;\n\nvarying vec2 vMainUV;\n\n\n\nuniform mat4 normalMatrix;\n\nattribute vec3 aNormal;\n\nvarying vec3 vNormal;\n\nvarying vec3 vPosition;\n\nvarying vec4 clipPos;\n\n\n\n\n\n#if (directLightsNum > 0)\n\nuniform DirectLight directLights[directLightsNum];\n\n    #ifdef RECEIVE_SHADOW\n\n    varying vec4 directShadowCoord[directLightsNum];\n\n    varying float directLightDepth[directLightsNum];\n\n    #endif\n\n#endif\n\n\n\n#if (spotLightsNum > 0)\n\nuniform SpotLight spotLights[spotLightsNum];\n\n    #ifdef RECEIVE_SHADOW\n\n    varying vec4 spotShadowCoord[spotLightsNum];\n\n    varying float spotLightDepth[spotLightsNum];\n\n    #endif\n\n#endif\n\n\n\n\n\nvoid main (){\n\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n\n    clipPos = gl_Position;\n\n    vec4 worldPos = (modelMatrix * vec4(position, 1.0));\n\n    vPosition = worldPos.xyz;\n\n    vNormal = (normalMatrix * vec4(aNormal, 1.0)).xyz;\n\n    vMainUV = aMainUV;\n\n\n\n    #ifdef RECEIVE_SHADOW\n\n        #if (directLightsNum > 0)\n\n        for (int i = 0; i < directLightsNum; ++i) {\n\n            directShadowCoord[i] = directLights[i].projectionMatrix * directLights[i].viewMatrix * worldPos;\n\n            directLightDepth[i] = length((directLights[i].viewMatrix * worldPos).xyz);\n\n        }\n\n        #endif\n\n\n\n        #if (spotLightsNum > 0)\n\n        for (int i = 0; i < spotLightsNum; ++i) {\n\n            spotShadowCoord[i] = spotLights[i].projectionMatrix * spotLights[i].viewMatrix * worldPos;\n\n            spotLightDepth[i] = length((spotLights[i].viewMatrix * worldPos).xyz);\n\n        }\n\n        #endif\n\n    #endif\n\n}\n\n";
        const interploters__forward__skybox_frag = "\nvarying vec3 cubeUV;\n\nuniform samplerCube uCubeTexture;\n\nvoid main()\n\n{\n\n    gl_FragColor = textureCube(uCubeTexture, cubeUV);\n\n}\n\n";
        const interploters__forward__skybox_vert = "\nattribute vec3 position;\n\nuniform mat4 viewProjectionMatrix;\n\nvarying vec3 cubeUV;\n\n\n\nvoid main (){\n\n    vec4 mvp = viewProjectionMatrix * vec4(position, 1.0);\n\n    cubeUV = position;\n\n    gl_Position = mvp.xyww;\n\n}\n\n";
    }
    export type ShaderLib = typeof ShaderSource.calculators__blinn_phong_glsl | typeof ShaderSource.calculators__blur__gaussian_glsl | typeof ShaderSource.calculators__blur__gaussian_log_glsl | typeof ShaderSource.calculators__linearlize_depth_glsl | typeof ShaderSource.calculators__packFloat1x32_glsl | typeof ShaderSource.calculators__phong_glsl | typeof ShaderSource.calculators__shadow_factor_glsl | typeof ShaderSource.calculators__types_glsl | typeof ShaderSource.calculators__unpackFloat1x32_glsl | typeof ShaderSource.debug__checkBox_glsl | typeof ShaderSource.definitions__light_glsl;
    export type ShadingVert = typeof ShaderSource.interploters__deferred__geometry_vert | typeof ShaderSource.interploters__deferred__tiledLight_vert | typeof ShaderSource.interploters__forward__esm__depth_vert | typeof ShaderSource.interploters__forward__esm__prefiltering_vert | typeof ShaderSource.interploters__forward__gouraud_vert | typeof ShaderSource.interploters__forward__phong_vert | typeof ShaderSource.interploters__forward__skybox_vert;
    export type ShadingFrag = typeof ShaderSource.interploters__deferred__geometry_frag | typeof ShaderSource.interploters__deferred__tiledLight_frag | typeof ShaderSource.interploters__forward__esm__depth_frag | typeof ShaderSource.interploters__forward__esm__prefiltering_frag | typeof ShaderSource.interploters__forward__gouraud_frag | typeof ShaderSource.interploters__forward__phong_frag | typeof ShaderSource.interploters__forward__skybox_frag;
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
        constructor(gl: WebGLRenderingContext, urls?: {
            xpos: string;
            xneg: string;
            ypos: string;
            yneg: string;
            zpos: string;
            zneg: string;
        });
        readonly wrapR: number;
        setWrapR(_wrapR: number): this;
        apply(gl: WebGLRenderingContext): this;
        applyForRendering(gl: WebGLRenderingContext, width: any, height: any): this;
        private createLoadPromise(image);
    }
}
declare module "materials/StandardMaterial" {
    import { vec3 } from "gl-matrix";
    import { Program } from "shader/Program";
    import { CubeTexture } from "textures/CubeTexture";
    import { Texture } from "textures/Texture";
    import { Material } from "materials/Material";
    export class StandardMaterial extends Material {
        protected _geometryShader: Program;
        protected _debug: boolean;
        protected _castShadow: boolean;
        protected _receiveShadow: boolean;
        protected _mainTexture: Texture;
        protected _ambient: vec3;
        protected _diffuse: vec3;
        protected _specular: vec3;
        protected _specularExponent: number;
        protected _specularMap: Texture;
        protected _transparency: number;
        protected _alphaMap: Texture;
        protected _bumpMap: Texture;
        protected _displamentMap: Texture;
        protected _stencilMap: Texture;
        protected _reflectivity: number;
        protected _environmentMap: CubeTexture;
        readonly geometryShader: Program;
        readonly debugMode: boolean;
        readonly castShadow: boolean;
        readonly receiveShadow: boolean;
        readonly mainTexture: Texture;
        readonly ambient: vec3;
        readonly diffuse: vec3;
        readonly specular: vec3;
        readonly specularExponent: number;
        transparency(): number;
        alphaMap(): Texture;
        readonly bumpMap: Texture;
        readonly displamentMap: Texture;
        readonly stencilMap: any;
        readonly reflectivity: number;
        readonly environmentMap: CubeTexture;
        setDebugMode(_debug: boolean): this;
        setCastShadow(_castShadow: boolean): this;
        setRecieveShadow(_receiveShadow: boolean): this;
        setMainTexture(_texture: Texture): this;
        setAmbient(_ambient: vec3): this;
        setDiffuse(_diffuse: vec3): this;
        setSpecular(_specular: vec3): this;
        setSpecularExponent(_specularExponent: number): this;
        setTransparency(_transparency: number): this;
        setAlphaMap(_alphaMap: any): this;
        setBumpMap(_bumpMap: Texture): this;
        setDisplamentMap(_displamentMap: Texture): this;
        setStencilMap(_stencilMap: Texture): this;
        setReflectivity(_reflectivity: number): this;
        setEnvironmentMap(_environmentMap: CubeTexture): this;
        protected initShader(gl: WebGLRenderingContext): Program;
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
        changeZoom(offset: number): this;
    }
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
declare module "renderer/SwapFramebuffer" {
    import { FrameBuffer } from "renderer/FrameBuffer";
    export class ProcessingFrameBuffer {
        private _candidates;
        private _activeIndex;
        private _gl;
        private _width;
        private _height;
        private _onInits;
        constructor(gl: WebGLRenderingContext);
        swap(): void;
        readonly active: FrameBuffer;
        onInit(callback: (frameBuffer: FrameBuffer) => void): this;
        setWidth(_width: number): this;
        setHeight(_height: number): this;
        attach(gl: WebGLRenderingContext, drawBuffer?: WebGLDrawBuffers): void;
        readonly width: any;
        readonly height: any;
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
declare module "lights/ShadowLevel" {
    export enum ShadowLevel {
        None = 0,
        Hard = 1,
        Soft = 2,
        PCSS = 3,
    }
}
declare module "lights/Light" {
    import { mat4, vec3 } from "gl-matrix";
    import { Camera } from "cameras/Camera";
    import { Geometry } from "geometries/Geometry";
    import { BoundingBox2D } from "Intersections/BoundingBox";
    import { Object3d } from "Object3d";
    import { WebGLExtension } from "renderer/IExtension";
    import { Renderer } from "renderer/Renderer";
    import { ProcessingFrameBuffer } from "renderer/SwapFramebuffer";
    import { IBuildinRenderParamMaps } from "shader/Program";
    import { Texture } from "textures/Texture";
    import { ShadowLevel } from "lights/ShadowLevel";
    export abstract class Light extends Object3d {
        volume: Geometry;
        protected _color: vec3;
        protected _idensity: number;
        protected _pcssArea: number;
        protected _shadowLevel: ShadowLevel;
        protected _shadowSoftness: number;
        protected _projectCamera: Camera;
        protected _shadowSize: number;
        protected gl: WebGLRenderingContext;
        protected ext: WebGLExtension;
        constructor(renderer: Renderer);
        abstract getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D;
        setColor(color: vec3): this;
        setIdensity(idensity: number): this;
        setShadowLevel(shadowLevel: ShadowLevel): this;
        setShadowSize(shadowSize: number): this;
        setShadowSoftness(_shadowSoftness: number): this;
        setPCSSArea(_pcssArea: number): this;
        readonly shadowLevel: ShadowLevel;
        readonly shadowSoftness: number;
        readonly shadowSize: number;
        readonly abstract shadowMap: Texture;
        readonly color: vec3;
        readonly idensity: number;
        readonly projectionMatrix: mat4;
        readonly viewMatrix: mat4;
        readonly pcssArea: number;
        readonly far: number;
        readonly near: number;
        readonly abstract shadowFrameBuffers: ProcessingFrameBuffer[];
        drawWithLightCamera(renderParam: IBuildinRenderParamMaps): void;
        abstract clearShadowFrameBuffer(): any;
        protected abstract init(render: Renderer): any;
    }
}
declare module "lights/DampingLight" {
    import { vec3 } from "gl-matrix";
    import { Light } from "lights/Light";
    export abstract class DampingLight extends Light {
        readonly position: vec3;
        protected _radius: number;
        protected _squareAttenuation: number;
        protected _linearAttenuation: number;
        protected _constantAttenuation: number;
        readonly squareAttenuation: number;
        readonly linearAttenuation: number;
        readonly constantAttenuation: number;
        readonly radius: number;
        setSquareAtten(atten: number): this;
        setLinearAtten(atten: number): this;
        setConstAtten(atten: number): this;
        abstract setRadius(radius: number): any;
    }
}
declare module "lights/SpotLight" {
    import { vec3 } from "gl-matrix";
    import { Camera } from "cameras/Camera";
    import { BoundingBox2D } from "Intersections/BoundingBox";
    import { Renderer } from "renderer/Renderer";
    import { ProcessingFrameBuffer } from "renderer/SwapFramebuffer";
    import { Texture } from "textures/Texture";
    import { DampingLight } from "lights/DampingLight";
    export class SpotLight extends DampingLight {
        protected _coneAngle: number;
        protected _shadowFrameBuffer: ProcessingFrameBuffer;
        constructor(renderer: Renderer);
        readonly shadowMap: Texture;
        readonly shadowFrameBuffer: ProcessingFrameBuffer;
        readonly shadowFrameBuffers: ProcessingFrameBuffer[];
        readonly spotDirection: vec3;
        readonly coneAngle: number;
        protected readonly coneAngleCos: number;
        setRadius(radius: number): this;
        setConeAngle(coneAngle: number): this;
        setSpotDirection(spotDirection: vec3): this;
        setShadowSize(_size: number): this;
        getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D;
        init(render: Renderer): this;
        clearShadowFrameBuffer(): void;
    }
}
declare module "lights/PointLight" {
    import { mat4, vec3 } from "gl-matrix";
    import { Camera } from "cameras/Camera";
    import { BoundingBox2D } from "Intersections/BoundingBox";
    import { Renderer } from "renderer/Renderer";
    import { ProcessingFrameBuffer } from "renderer/SwapFramebuffer";
    import { IBuildinRenderParamMaps } from "shader/Program";
    import { CubeTexture } from "textures/CubeTexture";
    import { DampingLight } from "lights/DampingLight";
    import { ShadowLevel } from "lights/ShadowLevel";
    export class PointLight extends DampingLight {
        private _spotLights;
        private _cubeTexture;
        constructor(renderer: Renderer);
        readonly shadowMap: CubeTexture;
        readonly shadowFrameBuffers: ProcessingFrameBuffer[];
        readonly projectionMatrix: mat4;
        readonly far: number;
        readonly near: number;
        setColor(color: vec3): this;
        setIdensity(idensity: number): this;
        setShadowLevel(shadowLevel: ShadowLevel): this;
        setShadowSize(shadowSize: number): this;
        setShadowSoftness(_shadowSoftness: number): this;
        setPCSSArea(_pcssArea: number): this;
        setRadius(radius: number): this;
        init(renderer: any): this;
        drawWithLightCamera(renderParam: IBuildinRenderParamMaps): void;
        clearShadowFrameBuffer(): void;
        getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D;
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
declare module "materials/ESM/DepthPackMaterial" {
    import { Program } from "shader/Program";
    import { Material } from "materials/Material";
    export class LinearDepthPackMaterial extends Material {
        protected initShader(gl: WebGLRenderingContext): Program;
    }
}
declare module "materials/ESM/LogBlurMaterial" {
    import { vec2 } from "gl-matrix";
    import { Program } from "shader/Program";
    import { Texture } from "textures/Texture";
    import { Material } from "materials/Material";
    export class PCSSFilteringMaterial extends Material {
        origin: Texture;
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
        private renderDepth(scene, light);
        private prefilterDepth(scene, light);
    }
}
declare module "renderer/Renderer" {
    import { Camera } from "cameras/Camera";
    import { IAsyncResource } from "IAsyncResource";
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
        waitAsyncResouces(asyncRes: IAsyncResource): Promise<void>;
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
    import { ProcessingFrameBuffer } from "renderer/SwapFramebuffer";
    import { Texture } from "textures/Texture";
    import { Light } from "lights/Light";
    export class DirectionalLight extends Light {
        protected _shadowFrameBuffer: ProcessingFrameBuffer;
        constructor(renderer: Renderer);
        readonly shadowMap: Texture;
        readonly shadowFrameBuffers: ProcessingFrameBuffer[];
        readonly direction: vec3;
        getProjecttionBoundingBox2D(camera: Camera): BoundingBox2D;
        setDirection(_direction: vec3): this;
        setShadowSize(_size: number): this;
        clearShadowFrameBuffer(): void;
        protected init(renderer: Renderer): this;
    }
}
declare module "Scene" {
    import { vec3 } from "gl-matrix";
    import { IDirtyable } from "Dirtyable";
    import { DirectionalLight } from "lights/DirectionalLight";
    import { Light } from "lights/Light";
    import { PointLight } from "lights/PointLight";
    import { SpotLight } from "lights/SpotLight";
    import { Object3d } from "Object3d";
    import { Texture } from "textures/Texture";
    export class Scene implements IDirtyable {
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
        private _directLightShadowMap;
        private _spotLightShadowMap;
        private _pointLightShadowMap;
        private _directShadowDirty;
        private _pointShadowDirty;
        private _spotShadowDirty;
        readonly directLightShadowMap: Texture[];
        readonly spotLightShadowMap: Texture[];
        readonly pointLightShadowMap: Texture[];
        clean(): void;
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
        lookAt(center: vec3, up?: vec3): this;
        lookAtLocal(center: vec3, up?: vec3): this;
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
    import { mat4, vec3, vec2 } from "gl-matrix";
    import { Object3d } from "Object3d";
    export enum CameraDirection {
        forward = 0,
        bakc = 1,
        left = 2,
        right = 3,
    }
    export abstract class Camera extends Object3d {
        protected _upVector: vec3;
        protected _centerVector: vec3;
        protected _rightVector: vec3;
        protected _projectionMatrix: mat4;
        protected _near: number;
        protected _far: number;
        private _controlEnable;
        private _cameraPitch;
        private _cameraYaw;
        private _cameraSpeed;
        constructor();
        readonly position: vec3;
        readonly near: number;
        readonly far: number;
        readonly eyeVector: vec3;
        readonly upVector: vec3;
        readonly centerVector: vec3;
        readonly rightVector: vec3;
        readonly projectionMatrix: mat4;
        setNear(near: number): this;
        setFar(far: number): this;
        controlEnable: boolean;
        changeDirectionByAngle(deltaAngle: vec2): void;
        abstract changeZoom(offset: number): any;
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
    import { Light } from "lights/Light";
    import { Scene } from "Scene";
    import { Texture } from "textures/Texture";
    import { Attribute } from "shader/Attibute";
    export interface IProgramSource {
        vertexShader: string;
        fragmentShader: string;
    }
    export interface IRenderParamHolder {
        hostObject?: object;
        defines?: {
            [index: string]: {
                defineName: string;
                useValue?: boolean;
                value: string;
            };
        };
        paramFilters?: {
            [index: string]: {
                name: string;
                filter: (value: string) => boolean;
            };
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
        light?: Light;
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
        private paramFilters;
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
        private filter(name);
        private updateDefines(buildinContainers);
        private updateOneDefines(holder, buildinContainers);
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
            normalViewMatrix: {
                type: DataType;
                updator: ({mesh, camera}: {
                    mesh: any;
                    camera: any;
                }) => mat4;
            };
        };
        defines: {
            filterSize: {
                defineName: string;
                value: string;
            };
            blockSize: {
                defineName: string;
                value: string;
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
    export function ifequal(defineName: string, defineValue: string): (proto: any, key: any) => void;
    export function ifgreat(defineName: string, defineValue: string): (proto: any, key: any) => void;
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
declare module "loader/ResourceFetcher" {
    export function fetchRes(url: string): Promise<{}>;
}
declare module "loader/obj_mtl/CommonPatterns" {
    export namespace patterns {
        const num: RegExp;
        const commentPattern: RegExp;
    }
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
    export { ShadowLevel } from "lights/ShadowLevel";
    export { OBJLoader } from "loader/obj_mtl/OBJLoader";
    export { Mesh } from "Mesh";
    export { Water } from "extensions/Water";
}
declare module "input/InputManager" {
    export class InputManager {
        private _controlEnable;
    }
}
