#ifdef USE_COLOR // color declaration
uniform vec4 color;
#endif // color declaration

#ifdef USE_TEXTURE // texture declaration
varying vec2 vTextureCoord;
uniform sampler2D uTextureSampler;
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
uniform vec3 eyePosition;
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
        vec3 lightDir = normalize(lights[index].position - vPosition);
        float lambortian = max(dot(lightDir, normal), 0.0);
        vec3 reflectDir = reflect(lightDir, normal);
        vec3 viewDir = normalize(eyePosition - vPosition);
        float specularAngle = max(dot(reflectDir, viewDir), 0.0);
        // TODO: replace the 2rd paramter to material shineness
        float specular = pow(specularAngle, 16.0);
        vec3 specularColor = lights[index].specular * specular;
        vec3 diffuseColor = lights[index].diffuse * lambortian;
        totalLighting += (diffuseColor + specularColor) * lights[index].idensity;
    }
    gl_FragColor = vec4(totalLighting, 1.0);
#endif
#ifdef USE_TEXTURE
    gl_FragColor = gl_FragColor * textureColor;
#endif
#ifdef USE_COLOR
    gl_FragColor = gl_FragColor * color;
#endif
}
