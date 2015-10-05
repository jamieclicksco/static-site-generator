var gulp         = require('gulp'),
    gutil        = require('gulp-util'),
    concat       = require('gulp-concat'),
    fileinclude  = require('gulp-file-include'),
    browserSync  = require('browser-sync').create(),
    sass         = require('gulp-sass'),
    minifyCss    = require('gulp-minify-css'),
    notify       = require('gulp-notify'),
    cache        = require('gulp-cache'),
    imagemin     = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    markdown     = require('markdown');

/*
 * Compile templates into html files, including markdown for docs.
 * @NOTE: Documentation here => https://github.com/coderhaoxin/gulp-file-include
 */

// Options for fileinclude
var view_compilation_options = {
    prefix: '@@',
    basepath: '@file',
    filters: {
        markdown: markdown.parse
    }
};

gulp.task('compileViews', function() {
    gulp.src(['src/pages/**/*.html'])
        .pipe(fileinclude(view_compilation_options))
        .pipe(gulp.dest('public'))
        .pipe(notify({ message: 'Views compiled' }));
});

/*
 * Compile SCSS
 */
gulp.task('sass', function () {
    gulp.src('src/assets/scss/main.scss')
        .pipe(sass())
        .on('error', gutil.log)
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('public/assets/css'))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('public/assets/css'))
        .pipe(browserSync.stream())
        .pipe(notify({ message: 'Sass task complete' }));
});

/*
 * Lint, Minify and Concat javascript files.
 * @TODO: Add a linter.
 * @TODO: Maybe add a minifier?
 */
gulp.task('scripts', function () {
    gulp.src("src/assets/javascript/**/*.js")
        .on('error', gutil.log)
        .pipe(gulp.dest("public/assets/js"));
});

/*
 * Compress images
 */
gulp.task('images', function () {
    gulp.src('src/assets/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
        .pipe(gulp.dest('public/assets/images/'))
        .pipe(notify({ message: 'Image compression complete' }));
});

/*
* Create a web server for development purposes : development only.
*/
gulp.task('serve', function () {
    browserSync.init({
        server: 'public/'
    });
});

/*
* Watch the files for changes and update accordingly
*/
gulp.task('watch', function () {
    gulp.watch('src/**/*.html', ['compileViews']);
    gulp.watch('src/**/*.md', ['compileViews']);
    gulp.watch('src/assets/scss/**/*.scss', ['sass']);
    gulp.watch('src/assets/javascript/**/*.js', ['scripts']);
    gulp.watch('src/assets/images/**', ['images']);
});

gulp.task('start-server', ['compileViews', 'sass', 'scripts', 'images', 'serve', 'watch']);
