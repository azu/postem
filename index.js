// LICENSE : MIT
"use strict";
console.log("NODE_ENV: " + process.env.NODE_ENV);
require("@electron/remote/main").initialize();
// Always use source files directly now (no babel compilation needed)
require("./src/node/node-app");
