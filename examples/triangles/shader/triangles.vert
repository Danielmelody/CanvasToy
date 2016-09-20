attribute vec3 position;
attribute vec2 aMainUV;
attribute vec2 triangleUV1;
attribute vec2 triangleUV2;
varying vec4 triangleColor;
uniform sampler2D uTextureSampler;
void main () {
    gl_Position = vec4(position, 1.0);
    triangleColor = (texture2D(uTextureSampler, aMainUV)
    + texture2D(uTextureSampler, triangleUV1)
    + texture2D(uTextureSampler, triangleUV2)) / 3.0;
}
