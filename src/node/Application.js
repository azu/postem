// LICENSE : MIT
"use strict";
import { app, screen } from "electron";
import { BrowserWindow } from 'electron';
import path from "path";
import WebMessenger from "./WebMessenger";
import { getDictionary, save } from "./textlint/dictionary-store";
import windowStateKeeper from 'electron-window-state';
import Positioner from "electron-positioner";

const ipcMain = require('electron').ipcMain;
import keys from "../browser/Action/ServiceActionConst";

export const WindowMode = {
    default: "default",
    twitter: "twitter"
};
export default class Application {
    get isDeactived() {
        return this.mainWindow === null;
    }

    constructor(mode = WindowMode.default) {
        this.mode = mode;
        this.mainWindow = null;
    }

    _createBrowserWindow() {
        const title = require("../../package.json").name;
        if (this.mode === WindowMode.default) {
            const mainWindowState = windowStateKeeper({
                defaultWidth: 320,
                defaultHeight: 480
            });
            process.title = title;
            const browserWindow = new BrowserWindow({
                title: title,
                frame: false,
                x: mainWindowState.x,
                y: mainWindowState.y,
                width: mainWindowState.width,
                height: mainWindowState.height
            });
            const positioner = new Positioner(browserWindow);
            if (mainWindowState.y === undefined || mainWindowState.x === undefined) {
                positioner.move('topRight');
            }
            const index = {
                html: path.join(__dirname, "..", "browser", "index.html")
            };
            browserWindow.loadURL('file://' + index.html);
            // Let us register listeners on the window, so we can update the state
            // automatically (the listeners will be removed when the window is closed)
            // and restore the maximized or full screen state
            mainWindowState.manage(browserWindow);
            return browserWindow;
        } else {
            process.title = title;
            const mainScreen = screen.getPrimaryDisplay();
            const dimensions = mainScreen.size;
            const browserWindow = new BrowserWindow({
                title: title,
                frame: false,
                width: dimensions.width - 80,
                height: 150,
                transparent: true
            });
            const positioner = new Positioner(browserWindow);
            positioner.move('bottomCenter');
            const index = {
                html: path.join(__dirname, "..", "mini-twitter", "index.html")
            };
            browserWindow.loadURL('file://' + index.html);
            return browserWindow;
        }
    }

    // focus existing running instance window
    restoreWindow(newArgv) {
        const window = this.mainWindow;
        if (window) {
            if (window.isMinimized()) {
                window.restore();
            }
            window.show();
            // restore with command line
            const argv = require('minimist')(newArgv.slice(2));
            const messenger = new WebMessenger(this.mainWindow.webContents);
            messenger.beforeUpdate(argv);
            if (argv.title) {
                messenger.updateTitle(argv.title);
            }
            if (argv.url) {
                messenger.updateURL(argv.url);
            }
            messenger.afterUpdate(argv);
        }
    }

    launch() {
        // command line
        const argv = require('minimist')(process.argv.slice(2));
        this.mainWindow = this._createBrowserWindow();
        this.mainWindow.webContents.on('did-finish-load', () => {
            const messenger = new WebMessenger(this.mainWindow.webContents);
            if (argv.title) {
                messenger.updateTitle(argv.title);
            }
            if (argv.url) {
                messenger.updateURL(argv.url);
            }
            //let server = new APIServer(this.mainWindow.webContents);
            //server.start();
        });
        if (this.mode === WindowMode.default) {
            // fetch new dictionary and update
            getDictionary(function(error, result) {
                if (error) {
                    return console.error(error);
                }
                console.log("Update: dictionary");
                save(result);
            });
        }
        let force_quit = false;
        app.on('before-quit', function(e) {
            force_quit = true;
        });

        this.mainWindow.on('close', (event) => {
            if (this.mode === WindowMode.twitter) {
                return;
            }
            if (!force_quit) {
                event.preventDefault();
                this.hide();
            }
        });
        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
        });
        // set top
        this.mainWindow.setAlwaysOnTop(true);
        this.registerIpcHandling();
    }

    show() {
        this.mainWindow.show();
    }

    hide() {
        this.mainWindow.hide();
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
