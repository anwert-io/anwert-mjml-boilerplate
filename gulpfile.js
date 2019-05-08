// TODOS:
// - clean, optimize images & file names
// - 

"use strict";

const 	gulp           = require('gulp'),
    		mjml           = require('gulp-mjml'),
    		watch          = require('gulp-watch'),
        fileinclude    = require('gulp-file-include'),
        clean          = require('gulp-clean'),
        imagemin       = require('gulp-imagemin');

var mjmlEngine = require('mjml').default
var config = {
    assetsDir: './assets',
    distDir: './dist',
    srcDir: './src',
    mjmlPattern: '*.mjml'
};


function cleanHtml() {
  return gulp.src([config.distDir]).pipe(clean());
}

function copyAssets(optimize = false) {
  gulp.src([config.assetsDir + '/**/*']).pipe(gulp.dest(config.distDir + '/assets'));
  gulp.src(config.distDir + '/assets/images/*')
        .pipe(imagemin([
          imagemin.jpegtran({progressive: true}),
         imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(gulp.dest(config.distDir + '/assets/images'))
}


function watchFiles() {
  gulp.watch(config.srcDir + '/**/' + config.mjmlPattern, mjml2html)
}

function handleError (err) {
  console.log(err.toString());
  this.emit('end');
}

function mjml2html() {
  copyAssets()

  return gulp.src(config.srcDir + '/' + config.mjmlPattern)
    .pipe(fileinclude({prefix: '@@', basepath: '@file'}))
    .pipe(mjml(mjmlEngine, {minify: true, validationLevel: 'strict'}))
    .on('error', handleError)
    .pipe(gulp.dest(config.distDir))
}


gulp.task('compile', mjml2html);
gulp.task('watch', gulp.parallel(watchFiles));
gulp.task('clean', cleanHtml);