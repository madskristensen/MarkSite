/// <binding ProjectOpened='watch' />
var gulp = require("gulp"),
	less = require("gulp-less");

gulp.task("default", ["watch"]);

gulp.task("less", function () {
	gulp.src("./themes/standard/less/site.less")
	  .pipe(less({ optimization: true }))
	  .pipe(gulp.dest("./themes/standard/"));
});

gulp.task("watch", ["less"], function () {

	gulp.watch(["./themes/standard/less/*.less"], ["less"]);
});