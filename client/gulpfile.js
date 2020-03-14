'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

sass.compiler = require('node-sass');

gulp.task('sass', function () {
    return gulp.src('./src/static/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('index.css'))
        .pipe(gulp.dest('./src/static/css'));
});

gulp.task('watch', function(){
    return gulp.watch('./src/static/sass/**/*.scss', gulp.series('sass'));
});