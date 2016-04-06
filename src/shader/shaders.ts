module CanvasToy {
export var common_frag = "//#gljs varname:'common_frag'\nprecision mediump float;\nvarying vec4 vColor;\nvoid main (void){\n    gl_FragColor = vColor;\n}\n"
export var common_vert = "//#gljs varname:'common_vert'\nprecision mediump float;\n\nattribute vec3 test;\nattribute vec3 position;\nattribute vec4 aColor;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nvarying vec4 vColor;\n\nvoid main (){\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    gl_Position = vec4(position, 1.0);\n    vColor = aColor;\n}\n"
}