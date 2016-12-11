// LICENSE : MIT
"use strict";
import {app} from "electron";
import Application from "./Application";
let application = null;
function startRenderApp() {
    // singleton application instance
    const shouldQuit = app.makeSingleInstance(function(argv, workingDirectory) {
        // focus existing running instance window
        if (application.isDeactived) {
            application.launch();
        } else {
            application.restoreWindow(argv);
        }
        return true;
    });

    if (shouldQuit) {
        return app.quit();
    }

    application = new Application();
    application.launch();
}


// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (application.isDeactived) {
        application.launch();
    } else {
        application.show();
    }
});
app.on('ready', function() {
    require("../share/profile").start();
    startRenderApp();
});
