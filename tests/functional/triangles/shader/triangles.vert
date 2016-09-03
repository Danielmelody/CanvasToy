attribute vec3 position;
attribute vec2 aTextureCoord;
varying vec2 vTextureCoord;
void main () {
    gl_Position = vec4(position, 1.0);
    vTextureCoord = aTextureCoord;
}
