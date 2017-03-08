uniform vec3 ambient;
uniform vec3 materialSpec;
uniform float materialSpecExp;
uniform vec3 materialDiff;

uniform mat4 cameraInverseMatrix;

#ifdef OPEN_LIGHT
uniform vec4 eyePos;
varying vec3 vNormal;
varying vec4 vPosition;
#endif

#ifdef _MAIN_TEXTURE
uniform sampler2D uMainTexture;
varying vec2 vMainUV;
#endif

#ifdef _ENVIRONMENT_MAP
uniform float reflectivity;
uniform samplerCube uCubeTexture;
#endif

uniform Light lights[LIGHT_NUM];
uniform SpotLight spotLights[LIGHT_NUM];

void main () {
#ifdef _MAIN_TEXTURE
    gl_FragColor = texture2D(uMainTexture, vMainUV);
#else
    gl_FragColor = vec4(1.0);
#endif
    vec3 color;
    vec3 normal = normalize(vNormal);
#ifdef OPEN_LIGHT
    vec3 totalLighting = ambient;
    for (int index = 0; index < LIGHT_NUM; index++) {
        totalLighting += calculate_light(
            vPosition,
            normal,
            lights[index].position,
            eyePos,
            materialSpec * lights[index].color,
            materialDiff * lights[index].color,
            materialSpecExp,
            lights[index].idensity
        );
    }
    color = totalLighting;
#endif
#ifdef _ENVIRONMENT_MAP
    vec3 worldPosition = (cameraInverseMatrix * vPosition).xyz;
    vec3 viewDir = worldPosition - eyePos.xyz;
    vec3 skyUV = reflect(-viewDir, vNormal);
    vec3 previous = color;
    color = mix(textureCube(uCubeTexture, skyUV).xyz, previous , 0.4);
#endif
    gl_FragColor *= vec4(color, 1.0);
}
