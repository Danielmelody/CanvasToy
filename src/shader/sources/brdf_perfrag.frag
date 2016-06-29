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
    for (int index = 0; index < LIGHT_NUM; index++) {
        vec3 lightDir = normalize(vPosition - lights[index].position);
        float lambortian = max(dot(normalize(vNormal), lightDir), 0.0);
        vec3 reflectDir = reflect(lightDir, vNormal);
        vec3 viewDir = normalize(eyePosition-vPosition);
        float specularAngle = max(dot(reflectDir, viewDir), 0.0);
        float specular = pow(specularAngle, lights[index].idensity);
        vec3 specularColor = lights[index].specular * specular;
        vec3 diffuseColor = lambortian * lights[index].diffuse;
        totalLighting = totalLighting + (diffuseColor + specularColor);
    }
#ifdef USE_TEXTURE
    totalLighting = totalLighting * textureColor.xyz;
#endif
#ifdef USE_COLOR
    totalLighting = totalLighting * color.xyz;
#endif
    gl_FragColor = vec4(totalLighting, 1.0);
#endif
}
