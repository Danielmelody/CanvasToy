#! /bin/sh
echo 'testing: build..'
tsc
echo 'testing: run..'
karma start karma.conf.js --browsers Chrome --single-run
