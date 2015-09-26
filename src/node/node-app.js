// LICENSE : MIT
"use strict";
import app from "app";
import accounts from "./storage/accounts";
import HatenaService from "./services/hatena/HatenaService";
import serviceManager from "./services/ServiceManager";
global.ServiceManager = serviceManager;
let hatena = new HatenaService(accounts);
function startRenderApp() {
    var Application = require("./Application");
    var application = new Application();
    application.launch();
    serviceManager.setTagService(hatena);
    serviceManager.addService(hatena);
}

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});
app.on('ready', function () {
    require("electron-template-menu")();
    if (hatena.canAccess()) {
        startRenderApp();
    } else {
        hatena.requireAccess().then(startRenderApp).catch(error => {
            console.error(error, error.stack);
        });
    }
});
