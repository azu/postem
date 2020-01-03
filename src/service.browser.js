const path = require("path");
module.exports = [
    {
        enabled: true,
        name: "jser.info API",
        isDefaultChecked: true,
        index: require("./services/jser.info-api/index")
    },
    // Last service is special
    // Assign shortcut as Cmd + 0
    {
        enabled: process.env.NODE_ENV === "development",
        name: "debug",
        index: require("./services/debug/index")
    }
];
