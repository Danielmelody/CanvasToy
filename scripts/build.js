const loader = require('./glslLoader')
const tsc = require('./tsc')
const fs = require('fs');

console.log("building: convert shaders...");
loader.convertGLSL();
console.log("building: compile engine...");
tsc.compile("tsconfig.json")
console.log("building: compile examples...");
tsc.compile("examples/tsconfig.json");
console.log("building: done.");