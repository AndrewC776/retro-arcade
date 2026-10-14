var gulp = require('gulp');
var del = require('del');
var connect = require('gulp-connect');
var open = require('gulp-open');
var zip = require('gulp-zip');
var sourcemaps = require("gulp-sourcemaps");
// var package = require('./package.json');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('clean', function() {
    del.sync(['dist/**', '!dist']);
});

gulp.task('connect', function() {
    connect.server({
        port: 8200,
        livereload: true
    });
});

gulp.task('reload', function() {
    gulp.src('index.html').pipe(connect.reload());
});

gulp.task("zip", function() {
    var date = new Date(),
        vers = (date.getMonth() + 1) + "_" + date.getDate();
    return gulp.src(["dist/*.js", "index.html"], {
            base: "."
        })
        .pipe(zip("game_" + vers + ".zip"))
        .pipe(gulp.dest("./submission"));
});

gulp.task('compile', ['clean'], function() {
    return gulp.src(["./src/*.js"])
        .pipe(sourcemaps.init())
        .pipe(concat("game.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: './src'
        }))
        .pipe(gulp.dest("./dist"));
});

gulp.task('watch', function() {
    gulp.watch(['./src/*.js', 'index.html'], ['compile', 'reload']);
});

gulp.task('open', function() {
    gulp.src('').pipe(open({
        uri: 'http://localhost:8200'
    }));
});

gulp.task('default', ['connect', 'open', 'watch']);
