module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
        },
        glsl: {
            dev: {
                options: {
                    oneString: false
                },
                files: {
                    'src/shader/ShaderBlockResult.ts': ['src/shader/ShaderBlocks/*.vert', 'src/shader/ShaderBlocks/*.frag' ]
                }
            }
        }

    });

    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-glsl');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // 默认被执行的任务列表。

    grunt.registerTask('default', ['uglify']);

};
