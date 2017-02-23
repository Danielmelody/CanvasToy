attribute vec3 position;
varying vec3 vPosition;

void main()
{
    gl_Position = vec4(position, 1.0);
    vPosition = position;
}
