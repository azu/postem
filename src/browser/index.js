// LICENSE : MIT
"use strict";
if (process.env.NODE_ENV === 'development') {
    require("@babel/register");
}
require("./App");
require("../share/profile").stop();
