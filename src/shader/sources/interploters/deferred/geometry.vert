attribute vec3 position;
uniform mat4 modelViewProjectionMatrix;

#ifdef USE_TEXTURE
attribute vec2 aMainUV;
varying vec2 vMainUV;
#endif

#ifdef OPEN_LIGHT
uniform mat4 normalMatrix;
attribute vec3 aNormal;
varying vec3 vNormal;
varying vec4 vPosition;
varying vec4 vDepth;
#endif

void main (){
    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);
#ifdef OPEN_LIGHT
    vNormal = (normalMatrix * vec4(aNormal, 1.0)).xyz;
    vPosition = gl_Position;
    vDepth = gl_Position.z / gl_Position.w;
#endif

#ifdef USE_TEXTURE
    vMainUV = aMainUV;
#endif
}
