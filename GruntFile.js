module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            // define the files to lint
            files: ['src/**/*.js'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
                // more options here if you want to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        concat_in_order: {
            options: {
                // 定义一个用于插入合并输出文件之间的字符
                separator: ';'
            },
            dist: {
                // 将要被合并的文件
                src: ['src/**/*.js'],
                // 合并后的JS文件的存放位置
                dest: 'build/<%= pkg.name %>.js'
            }
        },
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>-min.js'
            }
        }
    });

    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-concat-in-order');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    // 默认被执行的任务列表。
    grunt.registerTask('default', ['uglify']);

};