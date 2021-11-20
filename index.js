// LICENSE : MIT
"use strict";
console.log("NODE_ENV: " + process.env.NODE_ENV);
require('@electron/remote/main').initialize();
if (process.env.NODE_ENV === "development") {
    require("@babel/register");
    // Start Node -> Browser
    require("./src/node/node-app");
} else {
    require("./lib/node/node-app");
}
