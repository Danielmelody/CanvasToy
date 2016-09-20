#ifdef USE_COLOR // color declaration
uniform vec4 color;
#endif // color declaration

#ifdef USE_TEXTURE // texture declaration
varying vec2 vMainUV;
uniform sampler2D uMainTexture;
vec4 textureColor;
#endif // texture declaration

#ifdef OPEN_LIGHT // light declaration
struct Light {
    vec3 specular;
    vec3 diffuse;
    float idensity;
    vec3 position;
    bool directional;
};
uniform vec3 ambient;
uniform vec3 eyePos;
varying vec3 vPosition;
vec3 totalLighting;
uniform Light lights[LIGHT_NUM];
varying vec3 vNormal;
#endif // light declaration

void main() {
#ifdef USE_TEXTURE
    textureColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t));
#endif
#ifdef OPEN_LIGHT
    totalLighting = ambient;
    vec3 normal = normalize(vNormal);
    for (int index = 0; index < LIGHT_NUM; index++) {
        calculate_light()
    }
    gl_FragColor = vec4(totalLighting, 1.0);
#else
#ifdef USE_COLOR
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
#endif
#endif
#ifdef USE_TEXTURE
    gl_FragColor = gl_FragColor * textureColor;
#endif
#ifdef USE_COLOR
    gl_FragColor = gl_FragColor * color;
#endif
}
