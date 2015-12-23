// LICENSE : MIT
"use strict";
import app from 'app';
import BrowserWindow  from 'browser-window';
import path from "path";
import APIServer from "./APIServer";
import WebMessenger from "./WebMessenger";
import {getDictionary, save} from "./textlint/dictionary-store";
const argv = require('minimist')(process.argv.slice(2));
export default class Application {
    launch() {
        this.mainWindow = new BrowserWindow({
            title: require("../../package.json").name,
            width: 500,
            height: 500
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
    }
}
