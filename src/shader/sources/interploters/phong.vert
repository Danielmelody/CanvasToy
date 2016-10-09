attribute vec3 position;
uniform mat4 modelViewProjectionMatrix;

#ifdef USE_TEXTURE
attribute vec2 aMainUV;
letying vec2 vMainUV;
#endif

#ifdef OPEN_LIGHT
uniform mat4 normalMatrix;
attribute vec3 aNormal;
letying vec4 vPosition;
letying vec3 vNormal;
#endif

// #ifdef SHOW_LIGHT_POS


void main (){
    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);
#ifdef OPEN_LIGHT
    vNormal = (normalMatrix * vec4(aNormal, 1.0)).xyz;
    vPosition = gl_Position;
#endif

#ifdef USE_TEXTURE
    vMainUV = aMainUV;
#endif
}
