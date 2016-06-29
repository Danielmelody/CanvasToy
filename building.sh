#! /bin/sh
node utils/glslLoader.js
tsfmt **/*.ts -r
tsc
grunt concat
grunt uglify
