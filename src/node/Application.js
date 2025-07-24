// LICENSE : MIT
"use strict";
const { app, BrowserWindow } = require("electron");
const Positioner = require("electron-positioner");
const windowStateKeeper = require("electron-window-state");
const path = require("path");
const keys = require("../shared/ServiceActionConst");
const WebMessenger = require("./WebMessenger");

const ipcMain = require("electron").ipcMain;

class Application {
    get isDeactived() {
        return this.mainWindow === null;
    }

    constructor() {
        this.mainWindow = null;
    }

    _createBrowserWindow() {
        const title = "postem";
        const mainWindowState = windowStateKeeper({
            defaultWidth: 320,
            defaultHeight: 480
        });
        const browserWindow = new BrowserWindow({
            title: title,
            frame: false,
            x: mainWindowState.x,
            y: mainWindowState.y,
            width: mainWindowState.width,
            height: mainWindowState.height,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        });
        const positioner = new Positioner(browserWindow);
        if (mainWindowState.y === undefined || mainWindowState.x === undefined) {
            positioner.move("topRight");
        }
        const index = {
            html: path.join(__dirname, "..", "browser", "index.html")
        };
        browserWindow.loadURL("file://" + index.html);

        // ブラウザのコンソールログをNode.js側にリダイレクト
        browserWindow.webContents.on("console-message", (event, level, message, line, sourceId) => {
            const logLevels = ["", "warn", "error"];
            const logMethod = logLevels[level] || "log";
            console[logMethod](`[Renderer] ${message}`);
            if (line && sourceId) {
                console[logMethod](`    at ${sourceId}:${line}`);
            }
        });

        // JavaScriptエラーをキャッチ
        browserWindow.webContents.on("crashed", () => {
            console.error("[Renderer] Renderer process crashed");
        });

        browserWindow.webContents.on("unresponsive", () => {
            console.warn("[Renderer] Renderer process became unresponsive");
        });

        // Let us register listeners on the window, so we can update the state
        // automatically (the listeners will be removed when the window is closed)
        // and restore the maximized or full screen state
        mainWindowState.manage(browserWindow);
        return browserWindow;
    }

    // focus existing running instance window
    restoreWindow(argvParsed) {
        const window = this.mainWindow;
        if (window) {
            if (window.isMinimized()) {
                window.restore();
            }
            window.show();
            // restore with command line
            const argv = argvParsed;
            const messenger = new WebMessenger(this.mainWindow.webContents);
            messenger.beforeUpdate(argv);
            if (argv.title) {
                messenger.updateTitle(argv.title);
            }
            if (argv.url) {
                messenger.updateURL(argv.url);
            }
            if (argv.quote) {
                messenger.updateQuote(argv.quote);
            }
            messenger.afterUpdate(argv);
        }
    }

    launch(argvParsed) {
        // command line
        const argv = argvParsed;
        this.mainWindow = this._createBrowserWindow();
        this.mainWindow.webContents.on("did-finish-load", () => {
            const messenger = new WebMessenger(this.mainWindow.webContents);
            if (argv.title) {
                messenger.updateTitle(argv.title);
            }
            if (argv.url) {
                messenger.updateURL(argv.url);
            }
            if (argv.quote) {
                messenger.updateQuote(argv.quote);
            }
            //let server = new APIServer(this.mainWindow.webContents);
            //server.start();
        });
        let force_quit = false;
        app.on("before-quit", function (e) {
            force_quit = true;
        });

        this.mainWindow.on("close", (event) => {
            if (!force_quit) {
                event.preventDefault();
                this.hide();
            }
        });
        this.mainWindow.on("closed", () => {
            this.mainWindow = null;
        });
        // set top
        this.mainWindow.setAlwaysOnTop(true);
        // integration remote
        require("@electron/remote/main").enable(this.mainWindow.webContents);
        this.registerIpcHandling();
    }

    show() {
        if (this.mainWindow) {
            this.mainWindow.show();
        }
    }

    hide() {
        if (this.mainWindow) {
            this.mainWindow.hide();
        }
    }

    close() {
        if (this.mainWindow) {
            this.mainWindow.destroy();
        }
        this.mainWindow = null;
    }

    registerIpcHandling() {
        const postLinkSym = String(keys.postLink);
        // Automatically close window after posting is success.
        const hideWindow = () => {
            this.hide();
        };
        ipcMain.on(postLinkSym, () => {
            hideWindow();
        });
    }
}

module.exports = Application;
