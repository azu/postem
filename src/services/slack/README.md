## Slack

Add slack token and channel to `service.js`

```js
const path = require("path");
module.exports = [
    {
        enabled: true,
        isDefaultChecked: false,
        name: "slack",
        indexPath: path.join(__dirname, "services/slack/index.js"),
        options: {
            token: "xoxp-xxxx",
            channel: "general"
        }
    }
]
```

