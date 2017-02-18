attribute vec3 position;
uniform mat4 modelViewProjectionMatrix;

#ifdef _MAIN_TEXTURE
attribute vec2 aMainUV;
varying vec2 vMainUV;
#endif

#ifdef OPEN_LIGHT
uniform mat4 normalMatrix;
attribute vec3 aNormal;
varying vec3 vNormal;
varying vec4 vPosition;
#endif

void main (){
    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);
#ifdef OPEN_LIGHT
    vNormal = (normalMatrix * vec4(aNormal, 1.0)).xyz;
    vPosition = gl_Position;
#endif

#ifdef _MAIN_TEXTURE
    vMainUV = aMainUV;
#endif
}
