/// <binding ProjectOpened='watch' />

var gulp = require("gulp"),
	less = require("gulp-less"),
	concat = require("gulp-concat");

var path = "./themes/standard/";

gulp.task("default", ["less", "scripts"]);

gulp.task("scripts", function () {
	gulp.src([path + "js/dataService.js", path + "js/menu.js", path + "js/pinned.js"])
		.pipe(concat("site.js"))
		.pipe(gulp.dest(path + "output"));
});

gulp.task("less", function () {
	gulp.src(path + "less/site.less")
		.pipe(less({ optimization: true, compress: true }))
		.on("error", swallowError)
		.pipe(gulp.dest(path + "output"));

});

gulp.task("watch", ["less", "scripts"], function () {
	gulp.watch(path + "less/*.less", ["less"]);
	gulp.watch(path + "js/*.js", ["scripts"]);

});

//#region Helpers

function swallowError(error) {
	var msg = error.message.replace(process.cwd(), "");
	console.log(msg);
	this.emit('end');
}

//#endregion Helpers