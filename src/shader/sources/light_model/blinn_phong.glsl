vec3 calculateLight(
    Material material,
    vec3 position,
    vec3 normal,
    vec3 lightDir,
    vec3 eyePos,
    vec3 lightColor,
    float idensity
    ) {
    float lambortian = max(dot(lightDir, normal), 0.0);
    vec3 viewDir = normalize(eyePos - position);

    // replace R * V with N * H
    vec3 H = (lightDir + viewDir) / length(lightDir + viewDir);
    float specularAngle = max(dot(H, normal), 0.0);

    vec3 specularColor = material.specular * pow(specularAngle, material.specularExponent);
    vec3 diffuseColor = material.diffuse * lambortian;
    vec3 color = (diffuseColor + specularColor) * idensity * lightColor;
    return color;
}
