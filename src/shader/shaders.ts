module CanvasToy {
export const calculators__blinn_phong_glsl = "vec3 calculate_light(vec4 position, vec3 normal, vec3 lightPos, vec4 eyePos, vec3 specular, vec3 diffuse, float shiness, float idensity) {\n    vec3 lightDir = normalize(lightPos - position.xyz);\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize((eyePos - position).xyz);\n\n    // replace R * V with N * H\n    vec3 H = (lightDir + viewDir) / length(lightDir + viewDir);\n    float specularAngle = max(dot(H, normal), 0.0);\n\n    vec3 specularColor = specular * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n\nvec3 calculate_spot_light(vec4 position, vec3 normal, vec3 lightPos, vec3 spotDir, vec4 eyePos, vec3 specular, vec3 diffuse, float shiness, float idensity) {\n    vec3 lightDir = normalize(lightPos - position.xyz);\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize((eyePos - position).xyz);\n\n    // replace R * V with N * H\n    vec3 H = (lightDir + viewDir) / length(lightDir + viewDir);\n    float specularAngle = max(dot(H, normal), 0.0);\n\n    vec3 specularColor = specular * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n"
export const calculators__phong_glsl = "vec3 calculate_light(vec4 position, vec3 normal, vec4 lightPos, vec4 eyePos, vec3 specularLight, vec3 diffuseLight, float shiness, float idensity) {\n    vec3 lightDir = normalize((lightPos - position).xyz);\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize((eyePos - position).xyz);\n    float specularAngle = max(dot(reflectDir, viewDir), 0.0);\n    vec3 specularColor = specularLight * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n\nvec3 calculate_spot_light(vec4 position, vec3 normal, vec4 lightPos, vec4 eyePos, vec3 specularLight, vec3 diffuseLight, float shiness, float idensity) {\n    vec3 lightDir = normalize((lightPos - position).xyz);\n    float lambortian = max(dot(lightDir, normal), 0.0);\n    vec3 reflectDir = normalize(reflect(lightDir, normal));\n    vec3 viewDir = normalize((eyePos - position).xyz);\n    float specularAngle = max(dot(reflectDir, viewDir), 0.0);\n    vec3 specularColor = specularLight * pow(specularAngle, shiness);\n    vec3 diffuseColor = diffuse * lambortian;\n    return (diffuseColor + specularColor) * idensity;\n}\n"
export const definitions__light_glsl = "#ifdef OPEN_LIGHT // light declaration\nstruct Light {\n    vec3 color;\n    float idensity;\n    vec3 position;\n};\n\nstruct SpotLight {\n    vec3 color;\n    float idensity;\n    vec3 direction;\n    vec3 position;\n};\n\n#endif // light declaration\n"
export const env_map_vert = ""
export const interploters__depth_phong_frag = "uniform vec3 ambient;\nuniform vec3 depthColor;\n\nuniform float cameraNear;\nuniform float cameraFar;\n\nuniform sampler2D uMainTexture;\nvarying vec2 vMainUV;\n\nvoid main () {\n    float originDepth = texture2D(uMainTexture, vMainUV).r;\n    gl_FragColor = vec4(vec3(originDepth * 2.0 - 1.0), 1.0);\n}\n"
export const interploters__depth_phong_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n    vMainUV = aMainUV;\n}\n"
export const interploters__g_buffer_frag = ""
export const interploters__g_buffer_vert = ""
export const interploters__gouraud_frag = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\nvoid main() {\n#ifdef USE_TEXTURE\n    textureColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n#endif\n#ifdef OPEN_LIGHT\n    totalLighting = ambient + materialAmbient;\n    vec3 normal = normalize(vNormal);\n    gl_FragColor = vec4(totalLighting, 1.0);\n#else\n#ifdef USE_COLOR\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n#endif\n#endif\n#ifdef USE_TEXTURE\n    gl_FragColor = gl_FragColor * textureColor;\n#endif\n#ifdef USE_COLOR\n    gl_FragColor = gl_FragColor * color;\n#endif\n}\n"
export const interploters__gouraud_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vec3 normal = (normalMatrix * vec4(aNormal, 0.0)).xyz;\n    totalLighting = ambient;\n    normal = normalize(normal);\n    for (int index = 0; index < LIGHT_NUM; index++) {\n        totalLighting += calculate_light(gl_Position, normal, lights[index].position, eyePos, lights[index].specular, lights[index].diffuse, 4, lights[index].idensity);\n    }\n    vLightColor = totalLighting;\n#endif\n#ifdef USE_TEXTURE\n    vTextureCoord = aTextureCoord;\n#endif\n}\n"
export const interploters__phong_frag = "uniform vec3 ambient;\n\n\nuniform vec3 color;\nuniform vec3 materialSpec;\nuniform vec3 materialDiff;\nuniform vec3 materialAmbient;\n\n#ifdef OPEN_LIGHT\nuniform vec4 eyePos;\nvarying vec3 vNormal;\nvarying vec4 vPosition;\n#endif\n\n#ifdef USE_TEXTURE\nuniform sampler2D uMainTexture;\nvarying vec2 vMainUV;\n#endif\n\nuniform Light lights[LIGHT_NUM];\nuniform SpotLight spotLights[LIGHT_NUM];\n\nvoid main () {\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n#ifdef USE_COLOR\n    gl_FragColor = vec4(color, 1.0);\n#endif\n\n#ifdef USE_TEXTURE\n    gl_FragColor = gl_FragColor * texture2D(uMainTexture, vMainUV);\n#endif\n#ifdef OPEN_LIGHT\n    vec3 normal = normalize(vNormal);\n    vec3 totalLighting = ambient;\n    for (int index = 0; index < LIGHT_NUM; index++) {\n        totalLighting += calculate_light(\n            vPosition,\n            normal,\n            lights[index].position,\n            eyePos,\n            materialSpec * lights[index].color,\n            materialDiff * lights[index].color,\n            4.0,\n            lights[index].idensity\n        );\n    }\n    gl_FragColor *= vec4(totalLighting, 1.0);\n#endif\n}\n"
export const interploters__phong_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\n#ifdef USE_TEXTURE\nattribute vec2 aMainUV;\nvarying vec2 vMainUV;\n#endif\n\n#ifdef OPEN_LIGHT\nuniform mat4 normalMatrix;\nattribute vec3 aNormal;\nvarying vec3 vNormal;\nvarying vec4 vPosition;\n#endif\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vNormal = (normalMatrix * vec4(aNormal, 1.0)).xyz;\n    vPosition = gl_Position;\n#endif\n\n#ifdef USE_TEXTURE\n    vMainUV = aMainUV;\n#endif\n}\n"
}