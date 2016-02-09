// LICENSE : MIT
"use strict";
import BrowserWindow  from 'browser-window';
import path from "path";
import WebMessenger from "./WebMessenger";
import {getDictionary, save} from "./textlint/dictionary-store";
import windowStateKeeper from 'electron-window-state';
import Positioner from "electron-positioner";
const ipcMain = require('electron').ipcMain;
import keys from "../browser/Action/ServiceActionConst";
export default class Application {
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
        this.mainWindow = new BrowserWindow({
            title: require("../../package.json").name,
            frame: false,
            x: mainWindowState.x,
            y: mainWindowState.y,
            width: mainWindowState.width,
            height: mainWindowState.height
        });
        const positioner = new Positioner(this.mainWindow);
        if(mainWindowState.y === undefined || mainWindowState.x === undefined) {
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
        getDictionary(function (error, result) {
            if (error) {
                return console.error(error);
            }
            console.log("Update: dictionary");
            save(result);
        });

        // Let us register listeners on the window, so we can update the state
        // automatically (the listeners will be removed when the window is closed)
        // and restore the maximized or full screen state
        mainWindowState.manage(this.mainWindow);
        // set top
        this.mainWindow.setAlwaysOnTop(true);
        this.registerIpcHandling();
    }

    registerIpcHandling() {
        const postLinkSym = String(keys.postLink);
        // Automatically close window after posting is success.
        const closeWindow = () => {
            if (!this.mainWindow.isFocused()) {
                this.mainWindow.close();
            }
        };
        ipcMain.on(postLinkSym, () => {
            closeWindow();
        });
    }
}
