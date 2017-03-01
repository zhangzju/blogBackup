var gulp = require('gulp');
var markdownpdf = require('gulp-markdown-pdf');

gulp.task('default', function () {
    return gulp.src('docker管理员系列：在Windows8上部署docker环境.md')
        .pipe(markdownpdf())
        .pipe(gulp.dest('dist'));
});