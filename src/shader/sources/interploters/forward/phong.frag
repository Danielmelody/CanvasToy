uniform vec3 ambient;
uniform vec3 uMaterialSpec;
uniform float uMaterialSpecExp;
uniform vec3 uMaterialDiff;

uniform vec3 cameraPos;

varying vec2 vMainUV;
varying vec4 clipPos;

varying vec3 vNormal;
varying vec3 vPosition;

#ifdef _MAIN_TEXTURE
uniform sampler2D uMainTexture;
#endif

#ifdef _ENVIRONMENT_MAP
uniform float reflectivity;
uniform samplerCube uCubeTexture;
#endif

#if (directLightsNum > 0)
uniform DirectLight directLights[directLightsNum];
uniform sampler2D directLightShadowMap[directLightsNum];
#endif

#if (pointLightsNum > 0)
uniform PointLight pointLights[pointLightsNum];
#endif

#if (spotLightsNum > 0)
uniform SpotLight spotLights[spotLightsNum];
uniform sampler2D spotLightShadowMap[spotLightsNum];
#endif

#ifdef RECEIVE_SHADOW

    #if (directLightsNum > 0)
    varying vec4 directShadowCoord[directLightsNum];
    varying float directLightDepth[directLightsNum];
    #endif

    #if (pointLightsNum > 0)
    varying vec4 pointShadowCoord[pointLightsNum];
    varying float pointLightDepth[pointLightsNum];
    #endif

    #if (spotLightsNum > 0)
    varying vec4 spotShadowCoord[spotLightsNum];
    varying float spotLightDepth[spotLightsNum];
    #endif

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
    vec3 totalLighting = ambient;
    #ifdef _ENVIRONMENT_MAP
    vec3 viewDir = normalize(-vPosition);
    vec3 skyUV = reflect(viewDir, vNormal);
    totalLighting = mix(totalLighting, textureCube(uCubeTexture, skyUV).xyz, reflectivity);
    #endif
#if (directLightsNum > 0)
    for (int index = 0; index < directLightsNum; index++) {
        vec3 lighting = calculateDirLight(
            directLights[index],
            uMaterialDiff,
            uMaterialSpec,
            uMaterialSpecExp,
            vPosition,
            normal,
            cameraPos
        );
    #ifdef RECEIVE_SHADOW
        float lambertian = dot(-directLights[index].direction, normal);
        float shadowFactor = getSpotDirectionShadow(
            directShadowCoord[index].xy / directShadowCoord[index].w, 
            directLightShadowMap[index], 
            directLightDepth[index], 
            lambertian, 
            1.0 / directLights[index].shadowMapSize,
            directLights[index].shadowLevel,
            directLights[index].softness
        );
        lighting *= shadowFactor;
    #endif
        totalLighting += lighting;
    }
#endif
#if (pointLightsNum > 0)
    for (int index = 0; index < pointLightsNum; index++) {
        vec3 lighting = calculatePointLight(
            pointLights[index],
            uMaterialDiff,
            uMaterialSpec,
            uMaterialSpecExp,
            vPosition,
            normal,
            cameraPos
        );
        totalLighting += lighting;
    }
#endif
#if (spotLightsNum > 0)
    for (int index = 0; index < spotLightsNum; index++) {
        vec3 lighting = calculateSpotLight(
            spotLights[index],
            uMaterialDiff,
            uMaterialSpec,
            uMaterialSpecExp,
            vPosition,
            normal,
            cameraPos
        );
    #ifdef RECEIVE_SHADOW
        float lambertian = dot(-spotLights[index].spotDir, normal);
        float shadowFactor = getSpotDirectionShadow(
            spotShadowCoord[index].xy / spotShadowCoord[index].w, 
            spotLightShadowMap[index],
            spotLightDepth[index], 
            lambertian, 
            1.0 / spotLights[index].shadowMapSize,
            spotLights[index].shadowLevel,
            spotLights[index].softness
        );
        lighting *= shadowFactor;
    #endif
        totalLighting += lighting;

    }
#endif
    color += totalLighting;
    gl_FragColor *= vec4(color, 1.0);
}
