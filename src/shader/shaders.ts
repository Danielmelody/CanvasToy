module CanvasToy {
export var basic_frag = "#ifdef USE_COLOR\nvarying vec4 vColor;\n#endif\n\n#ifdef USE_TEXTURE\nvarying vec2 vTextureCoord;\nuniform sampler2D uTextureSampler;\nvec4 textureColor;\n#endif\n\nvoid main() {\n#ifdef USE_COLOR\n    gl_FragColor = vColor;\n#endif\n\n#ifdef USE_TEXTURE\n    textureColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n#endif\n\n}\n"
export var basic_vert = "attribute vec3 position;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform vec4 cameraPosition;\n\n#ifdef USE_COLOR\nattribute vec4 aColor;\nvarying vec4 vColor;\n#endif\n\n#ifdef USE_TEXTURE\nattribute vec2 aTextureCoord;\nvarying vec2 vTextureCoord;\n#endif\n\nvoid main (){\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\n#ifdef USE_COLOR\n    vColor = aColor;\n#endif\n\n#ifdef USE_TEXTURE\n    vTextureCoord = aTextureCoord;\n#endif\n\n}\n"
}