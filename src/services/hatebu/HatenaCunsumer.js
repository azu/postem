// LICENSE : MIT
"use strict";
var myConsumer;
try {
    myConsumer = require("./consumer.json");
} catch (error) {}
var builtinConsumer = myConsumer || {
    key: "elj9OpeplSmpfA==",
    secret: "1hqDhJ2BfB6kozd/nHeLIW7WC/Y="
};
export default builtinConsumer;
