"use strict";
const gulp = require("gulp");
const babel = require("gulp-babel");
const gulpif = require("gulp-if");
const path = require("path");
const fs = require("fs");
function isJS(file) {
    var fileExt = path.extname(file.relative);
    return fileExt === ".js";
}
gulp.task("build", function () {
    const babelOptions = JSON.parse(fs.readFileSync("./.babelrc", "utf-8"));
    const babelify = babel(babelOptions);
    return gulp.src("src/**/*", { base: "src" }).pipe(gulpif(isJS, babelify)).pipe(gulp.dest("lib/"));
});
