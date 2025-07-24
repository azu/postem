// LICENSE : MIT
import { BrowserWindow, ipcMain } from "electron";
import path from "node:path";

export default function prompt({ title, message, placeholder }, callback) {
    const mainWindow = new BrowserWindow({
        width: 300,
        height: 300,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });
    const index = {
        html: path.join(__dirname + "/index.html")
    };
    mainWindow.loadURL("file://" + index.html);
    import("@electron/remote/main").then((remote) => {
        remote.enable(mainWindow.webContents);
    });
    mainWindow.webContents.on("did-finish-load", () => {
        mainWindow.webContents.send("initialize", {
            title,
            message,
            placeholder
        });
    });
    ipcMain.on("finish", (event, response) => {
        mainWindow.close();
        callback(response);
    });
}
