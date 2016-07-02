attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

#ifdef USE_TEXTURE
attribute vec2 aTextureCoord;
varying vec2 vTextureCoord;
#endif

#ifdef OPEN_LIGHT
uniform mat4 normalMatrix;
attribute vec3 aNormal;
varying vec3 vPosition;
varying vec3 vNormal;
#endif

void main (){
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
#ifdef OPEN_LIGHT
    vNormal = (normalMatrix * vec4(aNormal, 0.0)).xyz;
    vPosition = gl_Position.xyz;
#endif

#ifdef USE_TEXTURE
    vTextureCoord = aTextureCoord;
#endif
}
