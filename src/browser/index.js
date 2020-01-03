// LICENSE : MIT
"use strict";
if (process.env.NODE_ENV === "development" && process.env.BROWSER !== "1") {
    require("@babel/register");
}
require("./App");
if (process.env.BROWSER !== "1") {
    require("../share/profile").stop();
}
