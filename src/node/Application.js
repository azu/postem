// LICENSE : MIT
"use strict";
import {app} from "electron";
import {BrowserWindow} from 'electron';
import path from "path";
import WebMessenger from "./WebMessenger";
import {getDictionary, save} from "./textlint/dictionary-store";
import windowStateKeeper from 'electron-window-state';
import Positioner from "electron-positioner";
const ipcMain = require('electron').ipcMain;
import keys from "../browser/Action/ServiceActionConst";
export default class Application {
    get isDeactived() {
        return this.mainWindow == null;
    }

    constructor() {
        this.mainWindow = null;
    }

    // focus existing running instance window
    restoreWindow(newArgv) {
        var window = this.mainWindow;
        if (window) {
            if (window.isMinimized()) {
                window.restore();
            }
            window.show();
            // restore with command line
            const argv = require('minimist')(newArgv.slice(2));
            const messenger = new WebMessenger(this.mainWindow.webContents);
            messenger.resetField();
            if (argv.title) {
                messenger.updateTitle(argv.title);
            }
            if (argv.url) {
                messenger.updateURL(argv.url);
            }
        }
    }

    launch() {
        // command line
        const argv = require('minimist')(process.argv.slice(2));
        let mainWindowState = windowStateKeeper({
            defaultWidth: 320,
            defaultHeight: 480
        });
        const title = require("../../package.json").name;
        process.title = title;
        this.mainWindow = new BrowserWindow({
            title: title,
            frame: false,
            x: mainWindowState.x,
            y: mainWindowState.y,
            width: mainWindowState.width,
            height: mainWindowState.height
        });
        const positioner = new Positioner(this.mainWindow);
        if (mainWindowState.y === undefined || mainWindowState.x === undefined) {
            positioner.move('topRight');
        }
        var index = {
            html: path.join(__dirname, "..", "browser", "index.html")
        };
        this.mainWindow.loadURL('file://' + index.html);
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
        // fetch new dictionary and update
        getDictionary(function(error, result) {
            if (error) {
                return console.error(error);
            }
            console.log("Update: dictionary");
            save(result);
        });
        let force_quit = false;
        app.on('before-quit', function(e) {
            force_quit = true;
        });

        this.mainWindow.on('close', (event) => {
            if (!force_quit) {
                event.preventDefault();
                this.hide();
            }
        });
        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
        });
        // Let us register listeners on the window, so we can update the state
        // automatically (the listeners will be removed when the window is closed)
        // and restore the maximized or full screen state
        mainWindowState.manage(this.mainWindow);
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
        const closeWindow = () => {
            if (this.mainWindow && !this.mainWindow.isFocused()) {
                this.hide();
            }
        };
        ipcMain.on(postLinkSym, () => {
            closeWindow();
        });
    }
}
