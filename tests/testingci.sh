#! /bin/sh

tsc -v
tsc
karma start karma.conf.js --browsers Firefox --single-run
