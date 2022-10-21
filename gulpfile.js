"use strict";

const gulp           = require('gulp'),
      mjml           = require('gulp-mjml'),
      fileinclude    = require('gulp-file-include'),
      imagemin       = require('gulp-imagemin'),
      newer          = require('gulp-newer'),
      browsersync    = require('browser-sync').create();

var mjmlEngine = require('mjml').default

var config = {
  assetsDir: './assets',
  distDir: './dist',
  srcDir: './src'
};

function handleError (err) {
  console.log(err.toString());
  this.emit('end');
}

function mjml2html() {
  return gulp
    .src(config.srcDir + "/*.mjml")
    .pipe(fileinclude({ prefix: "@@", basepath: "@file" }))
    .on("error", handleError)
    .pipe(mjml(mjmlEngine, { minify: true, validationLevel: "strict" }))
    .on("error", handleError)
    .pipe(gulp.dest(config.distDir))
    .on("error", handleError)
    .pipe(browsersync.stream());
}

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: config.distDir
    },
    port: 3000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function assets() {
  gulp
    .src([config.assetsDir + '/**/*'])
    .pipe(newer(config.distDir + '/assets'))
    .pipe(gulp.dest(config.distDir + '/assets'));

  return gulp
    .src(config.assetsDir + "/images/**/*")
    .pipe(newer(config.distDir + "/assets/images"))
    .pipe(
      imagemin([
        imagemin.mozjpeg({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
      ])
    )
    .pipe(gulp.dest(config.distDir + "/assets/images"));
}

function watchFiles() {
  gulp.watch(config.srcDir + '/**/*.mjml', gulp.series(gulp.parallel(mjml2html, assets), browserSyncReload));
  gulp.watch(config.srcDir + '/**/*.css', gulp.series(gulp.parallel(mjml2html, assets), browserSyncReload));
  gulp.watch(config.assetsDir + '/images/**/*', assets);
}

const build = gulp.parallel(mjml2html, assets);
const watch = gulp.parallel(watchFiles, browserSync);

exports.assets = assets;
exports.build = build;
exports.watch = watch;
exports.default = watch;