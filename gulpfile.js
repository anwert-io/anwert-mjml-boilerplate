// TODOS:
// - clean, optimize images & file names
// - 

"use strict";

const 	gulp           = require('gulp'),
    		mjml           = require('gulp-mjml'),
    		watch          = require('gulp-watch'),
        fileinclude    = require('gulp-file-include'),
        clean          = require('gulp-clean');

var mjmlEngine = require('mjml').default
var config = {
    assetsDir: './assets',
    htmlDir: './html',
    mjmlDir: './mjml',
    mjmlPattern: '*.mjml'
};


function cleanHtml() {
  return gulp.src([config.htmlDir]).pipe(clean());
}


function copyAssets() {
  gulp.src([config.assetsDir + '/**/*']).pipe(gulp.dest(config.htmlDir + '/assets'));
}


function watchFiles() {
  gulp.watch(config.mjmlDir + '/**/' + config.mjmlPattern, mjml2html)
}


function mjml2html() {
  copyAssets()

  return gulp.src(config.mjmlDir + '/' + config.mjmlPattern)
    .pipe(fileinclude({prefix: '@@', basepath: '@file'}))
    .pipe(mjml(mjmlEngine, {minify: true}))
    .pipe(gulp.dest('./html'))
}


gulp.task('mjml', mjml2html);
gulp.task('watch', gulp.parallel(watchFiles));
gulp.task('clean', cleanHtml);