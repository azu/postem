// LICENSE : MIT
"use strict";
import { app } from "electron";
import Application, { WindowMode } from "./Application";

const minimist = require('minimist');
let application = null;

function startRenderApp() {
    const shouldQuit = app.makeSingleInstance(function(argv, workingDirectory) {
        // singleton application instance
        const argvParsed = minimist(argv.slice(2));
        const isTwitter = argvParsed.twitter !== undefined;
        // focus existing running instance window
        const mode = isTwitter ? WindowMode.twitter : WindowMode.default;
        // difference mode, exit and launch
        if (mode !== application.mode) {
            application = new Application(mode);
            application.launch();
            return;
        }
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

    const argvParsed = minimist(process.argv.slice(2));
    const isTwitter = argvParsed.twitter !== undefined;
    application = new Application(isTwitter ? WindowMode.twitter : WindowMode.default);
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
