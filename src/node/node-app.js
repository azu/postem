// LICENSE : MIT
"use strict";
import app from "app";
import Application from "./Application";
let application = null;
function startRenderApp() {
    // singleton application instance
    var shouldQuit = app.makeSingleInstance(function (commandLine, workingDirectory) {
        // focus existing running instance window
        application.restoreWindow();
        return true;
    });

    if (shouldQuit) {
        return app.quit();
    }

    application = new Application();
    application.launch();
}

app.on('window-all-closed', function () {
    //if (process.platform != 'darwin') {
    app.quit();
    //}
});
app.on('ready', function () {
    require("electron-template-menu")();
    startRenderApp();
});
