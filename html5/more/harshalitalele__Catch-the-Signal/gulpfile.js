// include gulp
var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('build', function () {
    return gulp.src(['./createCharacter.js', './background.js', './app.js'])
        .pipe(concat('game.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['build'], function () {
});