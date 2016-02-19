module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs:{
            compile: {
                options: {
                    name:"CanvasToy",
                    baseUrl: "src",
                    out: "build/canvas-toy-nolibrary.js"
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/canvas-toy.js',
                dest: 'build/<%= pkg.name %>-min.js'
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['lib/**/*.js', 'build/canvas-toy-nolibrary.js'],
                dest: 'build/canvas-toy.js'
            }
        }
    });

    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    // 默认被执行的任务列表。
    grunt.registerTask('default', ['uglify']);

};
