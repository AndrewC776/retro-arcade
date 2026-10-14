const gulp = require('gulp');
const del = require('del');
const connect = require('gulp-connect');
const open = require('gulp-open');
const zip = require('gulp-zip');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;

gulp.task('clean', function() {
    del.sync(['dist/**', '!dist']);
});

gulp.task('connect', function() {
    connect.server({
        port: 8080,
        livereload: true
    });
});

gulp.task('reload', function() {
    setTimeout(function () {
        gulp.src('index.html').pipe(connect.reload());
    }, 1000);
});

gulp.task('zip', function() {
    const date = new Date(),
        vers = (date.getMonth() + 1) + '_' + date.getDate();
    return gulp.src(['dist/*.js', 'index.html'], {
            base: '.'
        })
        .pipe(zip('game_' + vers + '.zip'))
        .pipe(gulp.dest('./submission'));
});

gulp.task('compile', ['clean'], function() {
    return gulp.src(['./src/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('g.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: './src'
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
    gulp.watch(['./src/*.js', 'index.html'], ['compile', 'reload']);
});

gulp.task('open', function() {
    gulp.src('').pipe(open({
        uri: 'http://localhost:8080'
    }));
});

gulp.task('default', ['connect', 'compile', 'open', 'watch']);
