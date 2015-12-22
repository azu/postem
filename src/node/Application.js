// LICENSE : MIT
"use strict";
import app from 'app';
import BrowserWindow  from 'browser-window';
import path from "path";
import APIServer from "./APIServer";
export default class Application {
    launch() {
        this.mainWindow = new BrowserWindow({width: 500, height: 500});
        var index = {
            html: path.join(__dirname, "..", "browser", "index.html")
        };
        this.mainWindow.loadURL('file://' + index.html);
        this.mainWindow.webContents.on('did-finish-load', () => {
            //let server = new APIServer(this.mainWindow.webContents);
            //server.start();
        });
    }
}
