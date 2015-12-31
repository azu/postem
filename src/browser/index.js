// LICENSE : MIT
"use strict";
if (process.env.NODE_ENV === 'development') {
    require("babel-register");
}
window.addEventListener("DOMContentLoaded", function () {
    require("./App");
    require("../share/profile").stop();
});
