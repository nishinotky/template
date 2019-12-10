const gulp = require('gulp');
const browserSync = require("browser-sync");
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sassGlob = require('gulp-sass-glob');
const mmq = require('gulp-merge-media-queries');
const cssdeclsort = require('css-declaration-sorter');
const through2 = require('through2');

// browser sync
function browserSyncFunc(done) {
  browserSync.init({
    server: {
      baseDir: "./",
    },
    port: 4000,
    reloadOnRestart: true
  });
  done();
}

// sass
function sassFunc(done) {
  gulp
    .src('./assets/sass/style.scss')
    .pipe(sassGlob())
    .pipe(postcss([autoprefixer()]))
    .pipe(postcss([cssdeclsort({order: 'alphabetically'})]))
    .pipe(mmq())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(through2.obj((chunk, enc, callback) => {
      const date = new Date();
      chunk.stat.atime = date;
      chunk.stat.mtime = date;
      callback(null, chunk);
    }))
    .pipe(gulp.dest('./assets/css/'));
  done();
}

// watch
function watchFunc(done) {
  gulp.watch('./assets/sass/**', gulp.parallel(sassFunc));
  gulp.watch('./assets/css/*.css', gulp.parallel(reloadFunc));
	gulp.watch('./*.html', gulp.parallel(reloadFunc));
	done();
}

function reloadFunc(done) {
  browserSync.reload();
  done();
}

gulp.task('default', gulp.parallel( watchFunc, sassFunc, browserSyncFunc ));
