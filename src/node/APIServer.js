// LICENSE : MIT
"use strict";
import express from "express";
export default class APIServer {
    start() {
        let app = express();
        app.get('/', (req, res) => {
            res.send('Hello World!');
        });
        this.server = app.listen(3000, () => {
            console.log('Example app listening at http://localhost:3000', host, port);
        });
    }

    stop() {
        this.server && this.server.close();
    }
}