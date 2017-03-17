uniform vec3 ambient;
uniform vec3 materialSpec;
uniform float materialSpecExp;
uniform vec3 materialDiff;
varying vec2 vMainUV;

#ifdef OPEN_LIGHT
varying vec3 vNormal;
varying vec3 vPosition;
#endif

uniform sampler2D uMainTexture;

uniform float reflectivity;
uniform samplerCube uCubeTexture;

#if (DIR_LIGHT_NUM > 0)
uniform DirectLight directLights[DIR_LIGHT_NUM];
#endif

#if (POINT_LIGHT_NUM > 0)
uniform PointLight pointLights[POINT_LIGHT_NUM];
#endif

#if (SPOT_LIGHT_NUM)
uniform SpotLight spotLights[SPOT_LIGHT_NUM];
#endif

void main () {
#ifdef _MAIN_TEXTURE
    gl_FragColor = texture2D(uMainTexture, vMainUV);
#else
    #ifdef _DEBUG
    gl_FragColor = vec4(vec3(checkerBoard(vMainUV, 0.1)), 1.0);
    #else
    gl_FragColor = vec4(1.0);
    #endif
#endif
    vec3 color = vec3(0.0);
    vec3 normal = normalize(vNormal);
#ifdef OPEN_LIGHT
    vec3 totalLighting = ambient;
    #if (DIR_LIGHT_NUM > 0)
    for (int index = 0; index < DIR_LIGHT_NUM; index++) {
        totalLighting += calculateDirLight(
            directLights[index],
            materialDiff,
            materialSpec,
            materialSpecExp,
            vPosition,
            normal,
            vec3(0.0)
        );
    }
    #endif
    #if (POINT_LIGHT_NUM > 0)
    for (int index = 0; index < POINT_LIGHT_NUM; index++) {
        totalLighting += calculatePointLight(
            pointLights[index],
            materialDiff,
            materialSpec,
            materialSpecExp,
            vPosition,
            normal,
            vec3(0.0)
        );
    }
    #endif
    #if (SPOT_LIGHT_NUM > 0)
    for (int index = 0; index < SPOT_LIGHT_NUM; index++) {
        totalLighting += calculateSpotLight(
            spotLights[index],
            materialDiff,
            materialSpec,
            materialSpecExp,
            vPosition,
            normal,
            vec3(0.0)
        );
    }
    #endif
    color = totalLighting;
#endif
#ifdef _ENVIRONMENT_MAP
    vec3 viewDir = normalize(-vPosition);
    vec3 skyUV = reflect(-viewDir, vNormal);
    color = mix(color, textureCube(uCubeTexture, skyUV).xyz, reflectivity);
#endif
    gl_FragColor *= vec4(color, 1.0);
}
