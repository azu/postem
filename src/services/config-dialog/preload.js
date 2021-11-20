const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld(
    "api", {
        submit(value){
            ipcRenderer.send("finish", value);
        },
        onInitialize(listener) {
            ipcRenderer.on("initialize", (event, request) => listener(request));
        }
    }
);
