#define MAX_TILE_LIGHT_NUM 32

precision highp float;

uniform float uHorizontalTileNum;
uniform float uVerticalTileNum;
uniform float uLightListLengthSqrt;

uniform mat4 inverseProjection;

uniform sampler2D uLightIndex;
uniform sampler2D uLightOffsetCount;
uniform sampler2D uLightPositionRadius;
uniform sampler2D uLightColorIdensity;

uniform sampler2D normalRoughnessTex;
uniform sampler2D albedoMetallicTex;
uniform sampler2D depthTex;

uniform float cameraNear;
uniform float cameraFar;


varying vec3 vPosition;

vec3 decodeNormal(vec2 n)
{
   vec3 normal;
   normal.z = dot(n, n) * 2.0 - 1.0;
   normal.xy = normalize(n) * sqrt(1.0 - normal.z * normal.z);
   return normal;
}

vec3 decodePosition(float depth) {
    vec4 clipSpace = vec4(vPosition.xy, depth * 2.0 - 1.0, 1.0);
    vec4 homogenous = inverseProjection * clipSpace;
    return homogenous.xyz / homogenous.w;
}

void main() {
    vec2 uv = vPosition.xy * 0.5 + vec2(0.5);
    vec2 gridIndex = uv;
    vec4 lightIndexInfo = texture2D(uLightOffsetCount, gridIndex);
    float lightStartIndex = lightIndexInfo.r;
    float lightNum = lightIndexInfo.w;
    vec4 tex1 = texture2D(normalRoughnessTex, uv);
    vec4 tex2 = texture2D(albedoMetallicTex, uv);

    vec3 normal = tex1.xyz;
    Material material;
    material.roughness = tex1.w;
    material.albedo = tex2.xyz;
    float depth = unpackFloat1x32(texture2D(depthTex, uv));
    vec3 viewPosition = decodePosition(depth);
    vec3 totalColor = vec3(0.0);
    int realCount = 0;
    for(int i = 0; i < MAX_TILE_LIGHT_NUM; i++) {
        if (float(i) > lightNum - 0.5) {
            break;
        }
        float fixlightId = texture2D(uLightIndex, vec2((lightStartIndex + float(i)) / uLightListLengthSqrt, 0.5)).x;
        vec4 lightPosR = texture2D(uLightPositionRadius, vec2(fixlightId, 0.5));
        vec4 lightColorIden = texture2D(uLightColorIdensity, vec2(fixlightId, 0.5));
        
        vec3 lightDir = normalize(lightPosR.xyz - viewPosition);

        float dist = distance(lightPosR.xyz, viewPosition);

        PointLight light;
        light.color = lightColorIden.xyz;
        light.idensity = lightColorIden.w;
        light.radius = lightPosR.w;
        light.position = lightPosR.xyz;
        light.squareAtten = 0.01;
        light.linearAtten = 0.01;
        light.constantAtten = 0.01;

        if (dist < light.radius) {
            totalColor += calculatePointLight(
                light,
                material,
                viewPosition,
                normal,
                vec3(0.0)
            );
        }
    }
    vec3 test = vec3(float(realCount) / 32.0);
    gl_FragColor = vec4(totalColor, 1.0);
}
