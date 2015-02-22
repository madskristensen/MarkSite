/// <binding AfterBuild='default' />
var gulp = require("gulp"),
	less = require("gulp-less"),
	jshint = require("gulp-jshint");

gulp.task("default", ["less", "jshint"]);

gulp.task("less", function () {
	gulp.src("./themes/standard/less/site.less")
	  .pipe(less({ optimization: true }))
	  .pipe(gulp.dest("./themes/standard/"));
});

gulp.task("jshint", function () {
	gulp.src("./themes/**/*.js")
		.pipe(jshint({lookup: false}))
		.pipe(jshint.reporter("default", { verbose: true}))
});

gulp.task("watch", ["default"], function () {

	gulp.watch(["./themes/standard/less/*.less"], ["less"]);
	gulp.watch(["./themes/**/*.js"], ["jshint"]);
});