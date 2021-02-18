const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');
const mmq = require('gulp-merge-media-queries');
const cssdeclsort = require('css-declaration-sorter');
const through2 = require('through2');
const pug = require('gulp-pug');
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminOption = [
  imageminPngquant({ quality: [0.65, 0.8] }),
  imageminMozjpeg({ quality: 85 }),
  imagemin.gifsicle({
    interlaced: false,
    optimizationLevel: 1,
    colors: 256
  }),
  imagemin.mozjpeg(),
  imagemin.optipng(),
  imagemin.svgo()
];

// browser sync
function browserSyncFunc(done) {
  browserSync.init({
    server: {
      baseDir: './',
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
    .pipe(sourcemaps.init())
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
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./assets/css/'));
  done();
}

// pug
function pugFunc(done) {
  gulp
    .src(['pug/**/*.pug', '!pug/**/_*.pug'])
    .pipe(pug({
      pretty: true
    }))
    .pipe( gulp.dest('./') );
  done();
}

// watch
function watchFunc(done) {
  gulp.watch('./pug/**', gulp.parallel(pugFunc));
  gulp.watch('./assets/sass/**', gulp.parallel(sassFunc));
  gulp.watch('./assets/css/*.css', gulp.parallel(reloadFunc));
  gulp.watch('./assets/js/*.js', gulp.parallel(reloadFunc));
	gulp.watch('./*.html', gulp.parallel(reloadFunc));
	done();
}

function reloadFunc(done) {
  browserSync.reload();
  done();
}

gulp.task('default', gulp.parallel(watchFunc, pugFunc, sassFunc, browserSyncFunc));

// img minify
gulp.task('imagemin', function () {
  gulp
    .src('./assets/img/*.{png,jpg,gif,svg}')
    .pipe(imagemin(imageminOption))
    .pipe(gulp.dest('./assets/img'));
});
