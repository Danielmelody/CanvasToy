#! /bin/sh
node utils/glslLoader.js
tsc
grunt concat
grunt uglify
