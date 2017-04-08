attribute vec3 position;
uniform mat4 modelViewProjectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec2 aMainUV;
varying vec2 vMainUV;

uniform mat4 normalViewMatrix;
attribute vec3 aNormal;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec4 screenPos;


#ifdef USE_SHADOW

    #if (DIR_LIGHT_NUM > 0)
    uniform mat4 directShadowMatrices[DIR_LIGHT_NUM];
    varying vec4 directShadowCoord[DIR_LIGHT_NUM];
    #endif

    #if (POINT_LIGHT_NUM > 0)
    uniform mat4 pointShadowMatrices[POINT_LIGHT_NUM];
    varying vec4 pointShadowCoord[POINT_LIGHT_NUM];
    #endif

    #if (SPOT_LIGHT_NUM > 0)
    uniform mat4 spotShadowMatrices[SPOT_LIGHT_NUM];
    varying vec4 spotShadowCoord[SPOT_LIGHT_NUM];
    #endif

#endif

void main (){
    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);
    screenPos = gl_Position;
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vNormal = (normalViewMatrix * vec4(aNormal, 1.0)).xyz;
    vMainUV = aMainUV;

    #ifdef USE_SHADOW
        #if (DIR_LIGHT_NUM > 0)
        for (int i = 0; i < DIR_LIGHT_NUM; ++i) {
            directShadowCoord[i] = directShadowMatrices[i] * vec4(position, 1.0);
        }
        #endif

        #if (POINT_LIGHT_NUM > 0)
        for (int i = 0; i < POINT_LIGHT_NUM; ++i) {
            pointShadowCoord[i] = pointShadowMatrices[i] * vec4(position, 1.0);
        }
        #endif

        #if (SPOT_LIGHT_NUM > 0)
        for (int i = 0; i < SPOT_LIGHT_NUM; ++i) {
            spotShadowCoord[i] = spotShadowMatrices[i] * vec4(position, 1.0);
        }
        #endif
    #endif
}
