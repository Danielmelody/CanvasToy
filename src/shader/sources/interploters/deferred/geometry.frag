uniform Material uMaterial;

uniform vec3 eyePos;
varying vec3 vNormal;

#ifdef _MAIN_TEXTURE
uniform sampler2D uMainTexture;
varying vec2 vMainUV;
#endif

#ifdef _NORMAL_TEXTURE
uniform sampler2D uNormalTexture;
varying vec2 vNormalUV;
#endif

void main () {
    vec3 normal = normalize(vNormal);
#ifdef _NORMAL_TEXTURE
    gl_FragData[0] = vec4(normal, uMaterial.roughness);
#else
    gl_FragData[0] = vec4(normal, uMaterial.roughness);
#endif
#ifdef _MAIN_TEXTURE
    gl_FragData[1] = vec4(uMaterial.albedo * texture2D(uMainTexture, vMainUV).xyz, uMaterial.metallic);
#else
    gl_FragData[1] = vec4(uMaterial.albedo, uMaterial.metallic);
#endif
    // save 32 bit depth to render target 3
    gl_FragData[2] =  packFloat1x32(gl_FragCoord.z);
}
