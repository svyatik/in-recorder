

module.exports = function(grunt) {
  // require('jit-grunt')(grunt);
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2,
          sourceMap: true,
          sourceMapFilename: 'css/application.css.map'
        },
        files: {
          "css/compiled.css": "css/application.less" // destination file and source file
        }
      }
    },
    watch: {
      styles: {
        files: ['css/application.less'], // which files to watch
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    }
  });

  grunt.registerTask('default', ['less, watch']);
};
