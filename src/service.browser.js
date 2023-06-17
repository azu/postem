const path = require("path");
module.exports = [
    {
        enabled: process.env.NODE_ENV === "development",
        name: "debug",
        index: require("./services/debug/index")
    }
];
