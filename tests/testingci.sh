#! /bin/sh

tsc -v
tsc
cat ../lib/gl-matrix/gl-matrix.js > canvas-toy-test.js
cat canvas-toy-test-tmp.js >> canvas-toy-test.js
rm canvas-toy-test-tmp.js
karma start karma.conf.js --browsers Firefox --single-run
