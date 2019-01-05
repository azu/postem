// LICENSE : MIT
"use strict";
console.log("NODE_ENV: " + process.env.NODE_ENV);
require("@babel/polyfill");
if (process.env.NODE_ENV === 'development') {
    require("@babel/register");
    // Start Node -> Browser
    require("./src/node/node-app");
} else {
    require("./lib/node/node-app");
}
