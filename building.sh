#! /bin/sh
echo building: convert shaders...
node utils/glslLoader.js || exit 1
echo building: format codes...
tsfmt **/*.ts -r
echo building: compile codes...
rm -rf build
tsc || exit 1
echo "/// <reference path='./canvas-toy-amd'/>" > build/canvas-toy.d.ts
echo "export * from 'CanvasToy';" >> build/canvas-toy.d.ts
echo "export as namespace CanvasToy;" >> build/canvas-toy.d.ts
# cat browser/start.js > build/canvas-toy.js
# cat browser/almond.js >> build/canvas-toy.js
# cat build/canvas-toy-amd.js >> build/canvas-toy.js
# cat browser/end.js >> build/canvas-toy.js
echo building: uglifying...
# uglifyjs build/canvas-toy.js -o build/canvas-toy-min.js
echo building: build examples...
cd examples
tsc || exit 1
echo 'building: done.'
