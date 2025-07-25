// LICENSE : MIT
"use strict";
const url = require("url");
const defaultMenu = require("electron-default-menu");
const { Menu, app, shell } = require("electron");
import Application from "./Application";

app.setAsDefaultProtocolClient("postem");
const minimist = require("minimist");
let application = null;
let startupArgParsed;

function queryToArgs(urlString) {
    if (!urlString) {
        return;
    }
    const { query } = url.parse(urlString, true);
    return {
        title: query.title,
        url: query.url,
        quote: query.quote
    };
}

function openFromProtocol(urlString) {
    const argvParsed = queryToArgs(urlString);
    if (!application) {
        application = new Application();
        application.launch(argvParsed);
        return;
    }
    if (application.isDeactived) {
        application.launch(argvParsed);
    } else {
        application.restoreWindow(argvParsed);
    }
}

const gotTheLock = app.requestSingleInstanceLock();

function startRenderApp(argv) {
    if (!gotTheLock) {
        return app.quit();
    } else {
        app.on("second-instance", (event, commandLine, workingDirectory) => {
            // Someone tried to run a second instance, we should focus our window.
            if (application) {
                const argvParsed = minimist(commandLine.slice(2));
                application.restoreWindow(argvParsed);
            }
        });
    }

    const argvParsed = argv || minimist(process.argv.slice(2));
    application = new Application();
    application.launch(argvParsed);
}

// Quit when all windows are closed.
app.on("window-all-closed", function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    if (!app.isReady()) {
        return;
    }
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (application.isDeactived) {
        application.launch();
    } else {
        application.show();
    }
});

app.on("open-url", function (event, url) {
    event.preventDefault();
    if (!app.isReady()) {
        startupArgParsed = queryToArgs(url);
    } else {
        openFromProtocol(url);
    }
});

app.on("ready", function () {
    require("../share/profile").start();
    startRenderApp(startupArgParsed);

    // Get template for default menu
    const menu = defaultMenu(app, shell);
    // Set top-level application menu, using modified template
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
});
