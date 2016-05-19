/// <binding ProjectOpened='watch' />

var gulp = require("gulp"),
	less = require("gulp-less"),
	concat = require("gulp-concat");

var pathStandard = "./themes/standard/";
var pathBootstrap = "./themes/bootstrap/";

gulp.task("default", ["less", "scripts", "css"]);

gulp.task("scripts", function () {
	gulp.src([pathStandard + "js/*.js"])
		.pipe(concat("site.js"))
		.pipe(gulp.dest(pathStandard + "output"));

	gulp.src([
			pathBootstrap + "js/jquery-1.10.2.min.js",
			pathBootstrap + "js/bootstrap.min.js",
			pathBootstrap + "js/dataService.js",
			pathBootstrap + "js/menu.js",
			pathBootstrap + "js/pinned.js"
			])
		.pipe(concat("site.js"))
		.pipe(gulp.dest(pathBootstrap + "output"));
});

gulp.task("less", function () {
	gulp.src(pathStandard + "less/site.less")
		.pipe(less({ optimization: true, compress: true }))
		.on("error", swallowError)
		.pipe(gulp.dest(pathStandard + "output"));
});

gulp.task("css", function () {
	gulp.src([pathBootstrap + "css/bootstrap.css", pathBootstrap + "css/app.css"])
		.pipe(concat("site.css"))
		.pipe(gulp.dest(pathBootstrap + "output"));

});

gulp.task("watch", ["less", "scripts", "css"], function () {
	gulp.watch(pathStandard + "less/*.less", ["less"]);
	gulp.watch(pathStandard + "js/*.js", ["scripts"]);

	gulp.watch(pathBootstrap + "css/*.css", ["css"]);
	gulp.watch(pathBootstrap + "js/*.js", ["scripts"]);
});

//#region Helpers

function swallowError(error) {
	var msg = error.message.replace(process.cwd(), "");
	console.log(msg);
	this.emit('end');
}

//#endregion Helpers