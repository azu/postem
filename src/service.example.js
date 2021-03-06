const path = require("path");
module.exports = [
    {
        enabled: true,
        name: "twitter",
        indexPath: path.join(__dirname, "services/twitter/index.js")
    },
    {
        enabled: true,
        isDefaultChecked: true,
        name: "hatebu",
        indexPath: path.join(__dirname, "services/hatebu/index.js")
    },
    // For @azu services
    {
        enabled: false,
        name: "jser.info",
        indexPath: path.join(__dirname, "services/jser.info/index.js")
    },
    {
        enabled: false,
        name: "ecmascript-daily",
        indexPath: path.join(__dirname, "services/ecmascript-daily/index.js")
    },
    {
        enabled: false,
        name: "jser.info-ping",
        indexPath: path.join(__dirname, "services/jser.info-ping/index.js")
    },
    // Last service is special
    // Assign shortcut as Cmd + 0
    {
        enabled: process.env.NODE_ENV === "development",
        name: "debug",
        indexPath: path.join(__dirname, "services/debug/index.js")
    }
];
