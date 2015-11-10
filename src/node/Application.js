// LICENSE : MIT
"use strict";
import app from 'app';
import BrowserWindow  from 'browser-window';
import path from "path";
import APIServer from "./APIServer";
export default class Application {
    launch() {
        let server = new APIServer();
        server.start();
        this.mainWindow = new BrowserWindow({width: 400, height: 400});
        var index = {
            html: path.join(__dirname, "..", "browser", "index.html")
        };
        this.mainWindow.loadUrl('file://' + index.html);
        this.mainWindow.webContents.on('did-finish-load', function () {
        });
    }
}
