attribute vec3 position;
uniform mat4 modelViewProjectionMatrix;
uniform mat4 modelMatrix;

attribute vec2 aMainUV;
varying vec2 vMainUV;

uniform mat4 normalMatrix;
attribute vec3 aNormal;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec4 clipPos;


#if (directLightsNum > 0)
uniform DirectLight directLights[directLightsNum];
    #ifdef RECEIVE_SHADOW
    varying vec4 directShadowCoord[directLightsNum];
    varying float directLightDepth[directLightsNum];
    #endif
#endif

#if (spotLightsNum > 0)
uniform SpotLight spotLights[spotLightsNum];
    #ifdef RECEIVE_SHADOW
    varying vec4 spotShadowCoord[spotLightsNum];
    varying float spotLightDepth[spotLightsNum];
    #endif
#endif


void main (){
    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);
    clipPos = gl_Position;
    vec4 worldPos = (modelMatrix * vec4(position, 1.0));
    vPosition = worldPos.xyz;
    vNormal = (normalMatrix * vec4(aNormal, 1.0)).xyz;
    vMainUV = aMainUV;

    #ifdef RECEIVE_SHADOW
        #if (directLightsNum > 0)
        for (int i = 0; i < directLightsNum; ++i) {
            directShadowCoord[i] = directLights[i].projectionMatrix * directLights[i].viewMatrix * worldPos;
            directLightDepth[i] = length((directLights[i].viewMatrix * worldPos).xyz);
        }
        #endif

        #if (spotLightsNum > 0)
        for (int i = 0; i < spotLightsNum; ++i) {
            spotShadowCoord[i] = spotLights[i].projectionMatrix * spotLights[i].viewMatrix * worldPos;
            spotLightDepth[i] = length(spotLights[i].viewMatrix * worldPos).xyz);
        }
        #endif
    #endif
}
