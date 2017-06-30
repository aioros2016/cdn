var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();
var useref       = require('gulp-useref');
var ngAnnotate   = require('gulp-ng-annotate');
var htmlmin      = require('gulp-htmlmin');
var runSequence  = require('run-sequence');


// 静态服务器 + 监听 less/html 文件
gulp.task('browserSync', [], function() {
    browserSync.init({
        server: "./dist"
    });
});

gulp.task('watch', function (){
	gulp.watch("./src/**/*.*").on('change', browserSync.reload);
});

gulp.task('docmin', function(){
	return gulp.src('src/**/*.html')
		.pipe(useref())
		.pipe(gulp.dest('dist'))
});

gulp.task('ngmin', function () {
    return gulp.src('src/**/*.js')
        .pipe(ngAnnotate({single_quotes: true}))
        .pipe(gulp.dest('src'));
});

gulp.task('htmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('dist/**/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', function (callback) {
	runSequence('ngmin', 'docmin', 'htmlmin',
	    callback
	)
})

gulp.task('default', function (callback) {
	runSequence(['browserSync'], 'watch',
    	callback
	)
})