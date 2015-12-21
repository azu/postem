// LICENSE : MIT
"use strict";
import app from "app";
function startRenderApp() {
    var Application = require("./Application");
    var application = new Application();
    application.launch();
}

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});
app.on('ready', function () {
    require("electron-template-menu")();
    startRenderApp();
});
