// LICENSE : MIT
"use strict";
require("babel-register");
window.addEventListener("DOMContentLoaded", function () {
    require("./App");
    require("../share/profile").stop();
});
