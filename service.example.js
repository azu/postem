const path = require("path");
module.exports = [
    {
        enabled: true,
        name: "twitter",
        indexPath: path.join(__dirname, "src/services/twitter/index.js")
    },
    {
        // Can not disabled
        enabled: true,
        name: "hatebu",
        indexPath: path.join(__dirname, "src/services/hatebu/index.js")
    },
    // For @azu services
    {
        enabled: false,
        name: "jser.info",
        indexPath: path.join(__dirname, "src/services/jser.info/index.js")
    },
    {
        enabled: false,
        name: "ecmascript-daily",
        indexPath: path.join(__dirname, "src/services/ecmascript-daily/index.js")
    },
    {
        enabled: false,
        name: "jser.info-ping",
        indexPath: path.join(__dirname, "src/services/jser.info-ping/index.js")
    },
    // Last service is special
    // Assign shortcut as Cmd + 0
    {
        enabled: process.env.NODE_ENV === 'development',
        name: "debug",
        indexPath: path.join(__dirname, "src/services/debug/index.js")
    }
];
