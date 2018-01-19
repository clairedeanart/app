'use strict';
var gulp = require('gulp');
var path = require('path');

//css
const autoprefixer = require('gulp-autoprefixer'),
  minifycss      = require('gulp-cssnano'),
  gutil          = require('gulp-util'),
  sass           = require('gulp-sass'),
  bs             = require('browser-sync').create(),
  fontello       = require('gulp-fontello'),
  runSequence    = require('run-sequence'),
  del            = require('del'),
  rename         = require('gulp-rename'),
  uglify         = require('gulp-uglify'),
  cache          = require('gulp-cached'),
  progeny        = require('gulp-progeny');

const CSS_BUILD_DIR = path.resolve(__dirname, './public/css');
const CSS_BUILD_DIR_PROD = path.resolve(__dirname, './build/static/css');
const CSS_SOURCE_DIR = './src/styles/**/*.*';

gulp.task('dev', function() {
  bs.init(null, {
    proxy: "http://localhost:4040",
    port: 4444,
    ui: {
      port: 8080
    },
    open: true,
    notify: true,
  });
  runSequence(['fonts', 'sass', 'watch']);
});

gulp.task('watch', function() {
  gulp.watch(CSS_SOURCE_DIR, ['sass']);
});

gulp.task('fonts', function() {
  del(['fonts', 'public/fonts']);
  return gulp.src('./fontello.json')
    .pipe(fontello({
      font: 'fonts',
      css: './src/styles/icons'
    }))
    .pipe(rename(function(path) {
      if (path.extname === '.css') {
        path.extname = '.scss';
        if (path.basename[0] !== '_') {
          path.basename = '_' + path.basename;
        }
      }
    }))
    .pipe(gulp.dest(''))
    .pipe(gulp.dest('./public'))
    .on('end', function() {
      console.log('end')
        // del(['public/styles', 'fonts']);
    });
});

gulp.task('sass', function() {
  console.log('sass!')
  return gulp.src(CSS_SOURCE_DIR)
    .pipe(cache('style'))
    .pipe(progeny({extensionsList: ['scss', 'sass']}))
    .pipe(sass({
      indentedSyntax: true, // Enable .sass syntax!
      imagePath: '/images', // Used by the image-url helper
      includePaths: [ 'node_modules/modularscale-sass/stylesheets' ]
    }))
    .on('error', function(err) {
        gutil.log("[sass]", err.toString());
        this.emit('end');
    })
    .pipe(autoprefixer({ browsers: ['last 2 version'] }))
    .pipe(gulp.dest(CSS_BUILD_DIR))
    .pipe(bs.stream());
});

gulp.task('build-production', function() {
  return runSequence('fonts', 'production', 'complete');
});

gulp.task('production', function() {
  return gulp.src(CSS_SOURCE_DIR)
    .pipe(cache('style'))
    .pipe(progeny({extensionsList: ['scss', 'sass']}))
    .pipe(sass({
      indentedSyntax: true, // Enable .sass syntax!
      imagePath: '/images', // Used by the image-url helper
      includePaths: [ 'node_modules/modularscale-sass/stylesheets' ]
    }))
    .on('error', function(err) {
        gutil.log("[sass]", err.toString());
        this.emit('end');
    })
    .pipe(autoprefixer({ browsers: ['last 2 version'] }))
    .pipe(minifycss())
    .pipe(gulp.dest(CSS_BUILD_DIR));
});

gulp.task('complete', function() {
  console.log("Gulp Production Build Complete.");
});
