//#gljs varname:'common_vert'
precision mediump float;

attribute vec3 position;
attribute vec4 aColor;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec4 vColor;

void main (){
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vColor = aColor;
}
