varying vec3 cubeUV;
uniform samplerCube uCubeTexture;
void main()
{
    gl_FragColor = textureCube(uCubeTexture, cubeUV);
}
