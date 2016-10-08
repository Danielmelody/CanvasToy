
vec3 calculate_light(vec4 position, vec3 normal, vec4 lightPos, vec4 eyePos, vec3 specular, vec3 diffuse, float shiness, float idensity) {
    vec3 lightDir = normalize((lightPos - position).xyz);
    float lambortian = max(dot(lightDir, normal), 0.0);
    vec3 reflectDir = normalize(reflect(lightDir, normal));
    vec3 viewDir = normalize((eyePos - position).xyz);
    float specularAngle = max(dot(reflectDir, viewDir), 0.0);
    vec3 specularColor = specular * pow(specularAngle, shiness);
    vec3 diffuseColor = diffuse * lambortian;
    return (diffuseColor + specularColor) * idensity;
}
