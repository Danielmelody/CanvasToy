uniform vec3 ambient;
uniform vec3 materialSpec;
uniform float materialSpecExp;
uniform vec3 materialDiff;

#ifdef OPEN_LIGHT
varying vec3 vNormal;
varying vec3 vPosition;
#endif

#ifdef _MAIN_TEXTURE
uniform sampler2D uMainTexture;
varying vec2 vMainUV;
#endif

#ifdef _ENVIRONMENT_MAP
uniform float reflectivity;
uniform samplerCube uCubeTexture;
#endif

uniform PointLight lights[LIGHT_NUM];
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
            vec3(0.0),
            materialSpec * lights[index].color,
            materialDiff * lights[index].color,
            materialSpecExp,
            lights[index].idensity
        );
    }
    color = totalLighting;
#endif
#ifdef _ENVIRONMENT_MAP
    vec3 viewDir = normalize(-vPosition);
    vec3 skyUV = reflect(-viewDir, vNormal);
    color = mix(color, textureCube(uCubeTexture, skyUV).xyz, reflectivity);
#endif
    gl_FragColor *= vec4(color, 1.0);
}
