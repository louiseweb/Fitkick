const { src, dest, series, watch } = require('gulp');

// Styles
const scss = require('gulp-sass')(require('sass'));
const autoPrefixer = require('gulp-autoprefixer');
const cssMinify = require('gulp-clean-css');

function styles() {
    return src('./src/scss/**/*.scss', { sourcemaps: true })
        .pipe(scss())
        .pipe(autoPrefixer('last 2 versions'))
        .pipe(cssMinify())
        .pipe(dest('./dist/css/', { sourcemaps: '.' }));
}

// Scripts
const concat = require('gulp-concat');
const jsMinify = require('gulp-terser');

function scripts() {
    return src('./src/js/**/*.js', { sourcemaps: true })       
        .pipe(concat('script.js'))
        .pipe(jsMinify())
        .pipe(dest('./dist/js/', { sourcemaps: '.' }));
}

// Images
const imgMinify = require('gulp-imagemin');

function images() {
    return src('./src/img/*')
      .pipe(imgMinify())
      .pipe(dest('./dist/img'));
}

// Browsersync
const browsersync = require('browser-sync').create();

function browsersyncServe(cb){
    browsersync.init({
      server: {
        baseDir: '.'
      }
    });
    cb();
  }
  
  function browsersyncReload(cb){
    browsersync.reload();
    cb();
  }

// Watch Tasks 
function watchTask() {
    watch('*.html', browsersyncReload);
    watch(
            [
            './src/scss/**/*.scss',
            './src/js/**/*.js',
            './src/img/*'
            ],
            series(styles, scripts, images, browsersyncReload)
        );
}

exports.default = series(styles, scripts, images, browsersyncServe, watchTask);

// Build
exports.build = series(styles, scripts, images);