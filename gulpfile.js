const gulp = require('gulp');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const plumber = require('gulp-plumber');
const maps = require('gulp-sourcemaps');
const sync = require('browser-sync');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const pug = require('gulp-pug');

gulp.task('css', () => {
  return gulp
    .src('src/main.scss')
    .pipe(plumber())
    .pipe(maps.init())
    .pipe(
      sass({
        includePaths: ['./node_modules/normalize-scss/sass/'],
      }),
    )
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
      }),
    )
    .pipe(csso())
    .pipe(
      rename({
        suffix: '.min',
      }),
    )
    .pipe(maps.write())
    .pipe(plumber.stop())
    .pipe(gulp.dest('dist/css'))
    .pipe(sync.stream());
});

gulp.task('html', () => {
  return gulp
    .src('src/views/**/*.pug')
    .pipe(plumber())
  .pipe(pug({
    // Your options in here.
  }))
  .pipe(plumber.stop())
  .pipe(gulp.dest('dist/'))
  .pipe(sync.stream());
});

gulp.task('img', () => {
  return gulp
    .src('src/assets/img/**/*.*')
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ]),
    )
    .pipe(gulp.dest('dist/img'));
});

gulp.task('views', function buildHTML() {
  return gulp.src('views/*.pug')
  .pipe(pug({
    // Your options in here.
  }))
});

gulp.task('reload', () => {
  sync({
    server: {
      baseDir: 'dist/',
    },
    notify: false,
  });
});

gulp.task('watch', ['img', 'css', 'html', 'reload'], () => {
  watch('src/**/*.scss', () => gulp.start('css'));
  watch('src/**/*.pug', () => gulp.start('html'));
});
