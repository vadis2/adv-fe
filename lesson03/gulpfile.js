/**
 * Created by vadis on 06.08.16.
 */
'use strict';

const destDir = 'bin';
const gulp = require('gulp');
var bower = require('gulp-bower');
var gulpIf = require('gulp-if');
var concat = require('gulp-concat');
var less = require('gulp-less');
var argv = require('yargs').argv;
var cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var csscomb = require('gulp-csscomb');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var htmlhint = require("gulp-htmlhint");
const browserSync = require('browser-sync').create();
var htmlmin = require('gulp-htmlmin');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('bower', function () {
    return bower('libs');
});

gulp.task('copy-static', function () {
    return gulp.src(['images/**/*.{png,jpg,svg}', '*.html', '**.*.js'])
        .pipe(gulp.dest(destDir));
});

gulp.task('css', function () {
    return gulp.src('styles/**/*.less')
        .pipe(gulpIf(argv.prod, sourcemaps.init()))
        .pipe(concat('styles.css'))
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(gulpIf(argv.prod, sourcemaps.write()))
        .pipe(gulp.dest('bin/static'));
});
gulp.task('build', ['copy-static', 'css']);

gulp.task('hello', function (callback) {
    console.log("Hello");
    callback();
});

gulp.task('libs', function () {
    return gulp.src('libs/**/*.min.js')
        .pipe(gulp.dest('bin/libs'));
});

gulp.task('default', ['libs', 'build']);

gulp.task('images', function () {
    return gulp.src(['**/*.{png,jpg,svg}', '!node_modules/**/*.{png,jpg,svg}', '!libs/**/*.{png,jpg,svg}'])
        .pipe(gulp.dest('bin'));
});

/* move all html files to the bin with minification for prod arg*/
gulp.task('html', function () {
    return gulp.src(['**/*.html', '!node_modules/**/*.html', '!libs/**/*.html'])
        .pipe(gulpIf(argv.prod, htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('bin'));
});

gulp.task('clean', function () {
    return gulp.src(destDir + '/*', {read: false})
        .pipe(clean({force: true}));
});

gulp.task('watch', function () {
    gulp.watch('**/*.{png,jpg,svg}', ['images']);
    gulp.watch('**/*.html', ['html']);
    gulp.watch('**/*.js', ['js']);
    gulp.watch('**/*.js', ['js']);
    gulp.watch('**/*.less', ['css']);
});

gulp.task('js', function () {
    console.log(argv.prod);
    var compact = argv.prod || false;
    compact = (compact === 'true') ? false : true;
    console.log("compact: " + compact);
    return gulp.src('js/**/*.js')
        .pipe(gulpIf(compact, sourcemaps.init())) /* !compact do not work in gulpIf */
        .pipe(concat('afterConcat.js'))
        .pipe(uglify())
        .pipe(gulpIf(!compact, sourcemaps.write()))
        .pipe(gulp.dest('bin'));

});

/* Code style tasks */
gulp.task('csscomb', function () {
    return gulp.src('styles/*.less')
        .pipe(csscomb().on('error', handleError))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});

gulp.task('jscs', function () {
    return gulp.src('js/*.js')
        .pipe(jscs({
            fix: true,
            configPath: '.jscs.json'
        }).on('error', handleError))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});

gulp.task('jshint', function () {
    return gulp.src('js/*.js')
        .pipe(jshint().on('error', handleError))
        .pipe(jshint.reporter('default'));
});

gulp.task('htmlhint', function () {
    return gulp.src('*.html')
        .pipe(htmlhint('.htmlhintrc').on('error', handleError))
        .pipe(htmlhint.reporter());
});

gulp.task('style', ['csscomb', 'jscs', 'jshint', 'htmlhint']);

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
    return this;
}
/* end: Code style tasks */


gulp.task('serve', function () {
    browserSync.init({
        server: 'bin'
    });

    browserSync.watch('bin/**/*.*').on('change', browserSync.reload);
});

gulp.task('minify', function () {
    return gulp.src('*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('bin'));
});