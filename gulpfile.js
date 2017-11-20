var del   = require('del')
var gulp  = require('gulp')
var babel = require('gulp-babel')

gulp.task('clean', () => {
  return del(['dist/**'], {force: true})
})

gulp.task('compile-to-es5', () => {
  return gulp.src('./qssh.js')
    .pipe( babel({ "presets": ["es2015"] }) )
    .pipe(gulp.dest('./dist'))
})

gulp.task('build', ['clean', 'compile-to-es5'])
