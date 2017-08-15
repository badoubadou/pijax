// Gulpfile
var gulp = require('gulp');
var gutil = require('gulp-util');
var minifyCSS    = require('gulp-minify-css');
var stylus    = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var pug = require('gulp-pug');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');

var src_styl = './src/styl/*.styl';
var src_pug = './src/pug/*.pug';
var src_coffee = ['./src/coffee/*.coffee'];
var src_coffee_pjax = ['./src/coffee/module.coffee', './src/coffee/pjax.coffee'];
var src_coffee_script = ['./src/coffee/script.coffee'];

gulp.task('styl', function() {
    //implementation of the task
    gutil.log('== My Log Task ==');
    gulp.src(src_styl)
    .pipe(stylus({
		compress: true
	}))
	.pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
	.pipe(minifyCSS())
	.pipe(gulp.dest('./styles/'))
});

gulp.task('coffee', function() {
	 gulp.src(src_coffee_pjax)
	.pipe(coffee())
    .pipe(concat('pjax.js'))
	.pipe(gulp.dest('./scripts/'))
     gulp.src(src_coffee_script)
    .pipe(coffee())
    .pipe(concat('script.js'))
    .pipe(gulp.dest('./scripts/'))

});

gulp.task('pug', function() {
    gulp.src('./src/pug/*.pug')
	.pipe(pug({
	// Your options in here. 
	}))
	.pipe(gulp.dest('./'))
});

gulp.task('watch', function () {
    watch(src_styl, batch(function (events, done) {
        gulp.start('styl', done);
    }));
    watch(src_pug, batch(function (events, done) {
        gulp.start('pug', done);
    }));
    watch(src_coffee, batch(function (events, done) {
        gulp.start('coffee', done);
    }));
});

gulp.task('build',['styl', 'pug', 'coffee']);
gulp.task('default',['build', 'watch']);



