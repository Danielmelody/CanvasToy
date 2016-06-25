#version 100

attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec4 eyePosition;

#ifdef USE_COLOR
attribute vec3 aColor;
varying vec3 vColor;
#endif

#ifdef USE_TEXTURE
attribute vec2 aTextureCoord;
varying vec2 vTextureCoord;
#endif

#ifdef OPEN_LIGHT
attribute vec3 aNormal;
varying vec3 vPosition;
    #ifdef SMOOTH_SHADING
    varying vec3 vNormal;
    #endif
#endif

void main (){
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
#ifdef OPEN_LIGHT
    #ifdef SMOOTH_SHADING
    vNormal = aNormal;
    vPosition = gl_Position;
    #endif
#endif

#ifdef USE_COLOR
    vColor = aColor;
#endif

#ifdef USE_TEXTURE
    vTextureCoord = aTextureCoord;
#endif
}
