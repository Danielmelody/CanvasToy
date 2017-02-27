#define MAX_TILE_LIGHT_NUM 32

precision highp float;

uniform float uHorizontalTileNum;
uniform float uVerticalTileNum;

uniform mat4 inverseProjection;

uniform sampler2D uLightIndex;
uniform sampler2D uLightOffset;
uniform sampler2D uLightCount;
uniform sampler2D uLightPositionRadius;
uniform sampler2D uLightColorIdensity;

uniform sampler2D uNormalDepthSE;
uniform sampler2D uDiffSpec;

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

void main()
{
    vec2 uv = vPosition.xy * 0.5 + vec2(0.5);
    vec2 gridIndex = floor(uv * vec2(uHorizontalTileNum, uVerticalTileNum));
    int lightStartIndex = int(texture2D(uLightOffset, gridIndex).x);
    int lightNum = int(texture2D(uLightCount, gridIndex).x);
    vec4 tex1 = texture2D(uNormalDepthSE, uv);
    vec4 tex2 = texture2D(uDiffSpec, uv);

    vec3 materialDiff = tex2.xyz;
    vec3 materialSpec = vec3(tex2.w);
    float materialSpecExp = tex1.w;

    vec3 normal = decodeNormal(tex1.xy);
    vec3 viewPosition = decodePosition(tex1.z);
    vec3 totalColor = vec3(0.0);
    for(int i = 0; i < MAX_TILE_LIGHT_NUM; i++) {
        if (i > lightNum) {
            break;
        }
        int lightId = 0;// int(texture2D(uLightIndex, vec2(lightStartIndex + i, 0.5)).x);
        vec4 lightPosR = texture2D(uLightPositionRadius, vec2(lightId, 0.5));
        vec3 lightPos = lightPosR.xyz;
        float lightR = lightPosR.w;
        vec4 lightColorIden = texture2D(uLightColorIdensity, vec2(lightId, 0.5));
        vec3 lightColor = lightColorIden.xyz;
        float lightIdensity = lightColorIden.w;

        float dist = distance(lightPos, viewPosition);
        //if (dist < lightR) {
            // vec3 fixLightColor = lightColor / ((dist / lightR) * (dist / lightR));
            totalColor += calculate_light(
                viewPosition,
                normal,
                lightPos,
                vec3(0.0),
                materialSpec * lightColor,
                materialDiff * lightColor,
                materialSpecExp,
                lightIdensity
            );
            // vec3 lightDir = normalize(lightPos - viewPosition);
            // vec3 reflectDir = normalize(reflect(lightDir, normal));
            // vec3 viewDir = normalize( - viewPosition);
            // vec3 H = normalize(lightDir + viewDir);
            // float specularAngle = max(dot(H, normal), 0.0);
            // // vec3 specularColor = materialSpec * pow(specularAngle, materialSpecExp);
            // totalColor = vec3(specularAngle);
        //}
        //}
    }
    // vec3 depth = vec3(linearlizeDepth(cameraFar, cameraNear, tex1.z));
    // vec3 depth = vec3(tex1.z);
    gl_FragColor = vec4(totalColor, 1.0);
}
