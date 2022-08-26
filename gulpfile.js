const gulp = require('gulp');
const less = require('gulp-less');
const concat = require('gulp-concat-css');

/* ----------------------------------------- */
/*  Compile LESS
/* ----------------------------------------- */

const STYLES_LESS = ["styles/**/*.less"];
function compileLESS() {
  return gulp.src("styles/**/*.less")
    .pipe(less())
    .pipe(concat("_styles.css"))
    .pipe(gulp.dest("./styles"))
}

const css = gulp.series(compileLESS);

/* ----------------------------------------- */
/*  Watch Updates
/* ----------------------------------------- */

function watchUpdates() {
  gulp.watch(STYLES_LESS, css);
}

/* ----------------------------------------- */
/*  Export Tasks
/* ----------------------------------------- */

exports.default = gulp.series(
  gulp.parallel(css),
  watchUpdates
);

exports.css = css;
