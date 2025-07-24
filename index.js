// LICENSE : MIT
console.log("NODE_ENV: " + process.env.NODE_ENV);
import { initialize } from "@electron/remote/main/index.js";
initialize();

if (process.env.NODE_ENV === "development") {
    // @babel/register is not needed with ESM
    // Start Node -> Browser
    await import("./src/node/node-app.js");
} else {
    await import("./lib/node/node-app.js");
}
