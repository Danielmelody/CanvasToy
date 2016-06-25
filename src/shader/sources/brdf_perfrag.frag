#version 100

#ifdef USE_COLOR // color declaration
vec3 colorFactor;
#endif // color declaration 

#ifdef USE_TEXTURE // texture declaration
varying vec2 vTextureCoord;
uniform sampler2D uTextureSampler;
vec3 textureColor;
#endif // texture declaration

#ifdef OPEN_LIGHT // light declaration
struct Light {
    vec3 specular;
    vec3 diffuse;
    float idensity;
    vec4 position;
    bool directional;
};
uniform vec3 ambient;
uniform vec4 eyePosition;
varying vec3 vPosition;
uniform int lightsNum;
Light light[8];
varying vec3 vNormal;
#endif // light declaration

void main() {
#ifdef USE_COLOR

#endif

#ifdef USE_TEXTURE
    textureColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t));
#endif
#ifdef OPEN_LIGHT
    vec3 totalLighting = ambient;
    for (int index = 0; index < lightsNum; index++) {
            vec3 lightDir = normalize(vPosition - light[index].position).xyz;
            vec3 lambortian = max(dot(normalize(vNormal), lightDir), 0.0);
            vec3 reflectDir = reflect(lightDir, vNormal);
            vec3 viewDir = normalize(eyePosition-vPosition);
            vec3 specularAngle = max(dot(reflectDir, viewDir), 0.0);
            vec3 specularColor = light[index].specular * pow(specular, light.idensity);
            vec3 diffuseColor = diffuseColorFactor * light[index].diffuse;
            totalLighting = totalLighting + vec4(diffuseColor + specularColor, 1.0) * textureColor;
        }
        gl_FragColor = vec4(totalLighting, 1.0);
#endif
}
