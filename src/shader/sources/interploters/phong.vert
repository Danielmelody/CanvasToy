attribute vec3 position;
uniform mat4 modelViewProjectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec2 aMainUV;
varying vec2 vMainUV;

uniform mat4 normalViewMatrix;
attribute vec3 aNormal;
varying vec3 vNormal;
varying vec3 vPosition;

void main (){
    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vNormal = (normalViewMatrix * vec4(aNormal, 1.0)).xyz;
    vMainUV = aMainUV;
}
