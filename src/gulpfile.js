/// <binding ProjectOpened='watch' />
var gulp = require("gulp"),
	less = require("gulp-less");

gulp.task("default", ["less"]);

gulp.task("less", function () {
	gulp.src("./themes/standard/less/site.less")
	  .pipe(less({ optimization: true, compress: true }))
	  .pipe(gulp.dest("./themes/standard/"));
});

gulp.task("watch", ["default"], function () {

	gulp.watch(["./themes/standard/less/*.less"], ["less"]);
});