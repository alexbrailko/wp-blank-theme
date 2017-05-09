
// Get node components and gulp extensions
var fs = require('fs'),
    path = require('path'),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    minify_css = require('gulp-clean-css'),
    minify = require('gulp-minify'),
    watch = require('gulp-watch'),
    colors = require('colors'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util'),
    cond = require('gulp-cond'),
    production = gutil.env.production || process.env.NODE_ENV === 'production';
    plumber = require('gulp-plumber');

/**
 * Files that we should always be retrieving through LESS or JS
 * Site directories will be included automatically
 */
var defaults = {
    // Default LESS directories to include
    less: [
        'css/less/styles.less'
    ],
    //  Default places for any imports on said LESS files
    less_includes: [
        'css/less/'
    ],
    // Default JS directories to include
    js: [
        'js/*.js'
    ],
    // Default directories to watch for changes
    watch_js: [
    	'js/*.js'
    ],
    watch_less: [
    	'css/less/*.less'
    ]
};

/**
 * Handle Parse errors so it doesn't stop output
 *
 * @param object error JS error object
 * @return void
 */
// function handleError(error) {
//     'use strict';

//     console.log(error.toString());
// }

// var onError = function (err) {  
//   gutil.beep();
//   console.log(err);
//   this.emit('end');
// }; 

/**
 * js task
 *
 * Will collect JS files and concatenate/minify as required into
 * sites/SITE/min/a.js
 */


gulp.task('js', function () {
 
    gulp.src('js//**/*.js')
     
    .pipe(concat('theme.js'))

    .pipe(uglify())
     
    .pipe(gulp.dest('js'));
 
});

/**
 * less task
 *
 * Will collect less files and concatenate/minify as required into
 * /sites/SITE/min/a.css
 */

gulp.task("less", function() {
    return gulp.src(defaults.less)
            .pipe(plumber(function (error) {
                console.log(error.toString());
                this.emit('end');
            }))
            .pipe(sourcemaps.init())
            .pipe(less())
            .pipe(concat('css/styles.css'))
            //.pipe(plugins.autoprefixer())
            .pipe(sourcemaps.write("./"))
            .pipe(gulp.dest("./"));
});

/**
 * Watch tasks
 *
 * Look for changes in the defaults.watch folders and run the
 * default task if a change occurs.
 */

gulp.task('watch', function() {
    'use strict';

    gulp.watch(defaults.watch_less, ['less']);
});

// gulp.task('watch-js', function() {
//     'use strict';

//     gulp.watch(defaults.watch_js, ['js']);
// });

// Tell gulp that the default task is to run the following tasks
gulp.task('default', ['less']);
