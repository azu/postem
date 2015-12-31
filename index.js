// LICENSE : MIT
"use strict";
if (process.env.NODE_ENV === 'development') {
    require("babel-register");
    // Start Node -> Browser
    require("./src/node/node-app");
} else {
    require("./lib/node/node-app");
}
