// LICENSE : MIT
"use strict";
import app from 'app';
import BrowserWindow  from 'browser-window';
import path from "path";
import APIServer from "./APIServer";
import WebMessenger from "./WebMessenger";
import {getDictionary, save} from "./textlint/dictionary-store";
import windowStateKeeper from 'electron-window-state';
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
            defaultWidth: 500,
            defaultHeight: 500
        });
        this.mainWindow = new BrowserWindow({
            title: require("../../package.json").name,
            frame: false,
            x: mainWindowState.x,
            y: mainWindowState.y,
            width: mainWindowState.width,
            height: mainWindowState.height
        });
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
        // 辞書の更新
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
    }
}
