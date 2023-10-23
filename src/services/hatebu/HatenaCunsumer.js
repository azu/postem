// LICENSE : MIT
"use strict";
var myConsumer;
try {
    myConsumer = require("./consumer.json");
} catch (error) {}
// マシンごとに異なるconsumerを用意しないといけない
// https://github.com/hatena/Hatena-Bookmark-iOS-SDK/issues/40
const builtinConsumer = myConsumer || {
    key: "elj9OpeplSmpfA==",
    secret: "1hqDhJ2BfB6kozd/nHeLIW7WC/Y="
};
export default builtinConsumer;
