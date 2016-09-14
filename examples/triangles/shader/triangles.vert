attribute vec3 position;
attribute vec2 aTextureCoord;
varying vec4 triangleColor;
uniform sampler2D uTextureSampler;
void main () {
    gl_Position = vec4(position, 1.0);
    triangleColor = texture2D(uTextureSampler, aTextureCoord);
}
