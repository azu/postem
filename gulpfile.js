import gulp from "gulp";
import babel from "gulp-babel";
import gulpif from "gulp-if";
import path from "path";
import fs from "fs";

function isJS(file) {
    var fileExt = path.extname(file.relative);
    return fileExt === ".js";
}

gulp.task("build", function () {
    const babelOptions = JSON.parse(fs.readFileSync("./.babelrc", "utf-8"));
    const babelify = babel(babelOptions);
    return gulp.src("src/**/*", { base: "src" }).pipe(gulpif(isJS, babelify)).pipe(gulp.dest("lib/"));
});
