// LICENSE : MIT
"use strict";
import app from "app";
import Application from "./Application";
let application = null;
function startRenderApp() {
    // singleton application instance
    var shouldQuit = app.makeSingleInstance(function (argv, workingDirectory) {
        // focus existing running instance window
        application.restoreWindow(argv);
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
    require("../share/profile").start();
    require("electron-template-menu")();
    startRenderApp();
});
