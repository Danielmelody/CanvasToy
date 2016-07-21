#! /bin/sh
node utils/glslLoader.js
tsfmt **/*.ts -r
tsc
cat lib/modules/gl-matrix.js > build/canvas-toy.js
cat build/canvas-toy-nolibrary.js >> build/canvas-toy.js;
uglifyjs build/canvas-toy.js -o build/canvas-toy-min.js
