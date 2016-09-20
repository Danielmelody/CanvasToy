vec3 calculate_light(vec3 position, vec3 normal, vec3 lightPos, vec3 eyePos, vec3 specular, vec3 diffuse, float shiness, float idensity) {
    vec3 lightDir = normalize(lightPos - position);
    float lambortian = max(dot(lightDir, normal), 0.0);
    vec3 reflectDir = reflect(lightDir, normal);
    vec3 viewDir = normalize(eyePos - position);
    float specularAngle = max(dot(reflectDir, viewDir), 0.0);
    vec3 specularColor = specular * pow(specularAngle, shiness);
    vec3 diffuseColor = diffuse * lambortian * idensity;
    return diffuseColor + specularColor;
}
