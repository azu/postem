// LICENSE : MIT
"use strict";
import express from "express";
const ipc = require("ipc");
export default class APIServer {
    start() {
        let app = express();
        app.get('/', (req, res) => {
            let {title,url} = req.query;
            if (title) {
                ipc.send("updateTitle", title);
            }
            if (url) {
                ipc.send("updateURL", url);
            }
        });
        this.server = app.listen(14328, () => {
            console.log("listening at http://localhost:14328");
        });
    }

    stop() {
        this.server && this.server.close();
    }
}