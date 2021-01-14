# asocial-bookmark

[asocial-bookmark](https://github.com/azu/asocial-bookmark) is a personal bookmark system based on GitHub.

## Setting

Add your asocial-bookmark setting to `src/service.js`.

You should put [asocial-bookmark](https://github.com/azu/asocial-bookmark)'s options to `options` value.

```js
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
        name: "mybookmarks",
        indexPath: path.join(__dirname, "services/asocial-bookmark/index.js"),
        options: {
            "github": {
                "owner": "your-name",
                "repo": "your-repo",
                "ref": "heads/master",
                "token": "Your GitHub Token"
            }
        }
    },
    // Last service is special
    // Assign shortcut as Cmd + 0
    {
        enabled: process.env.NODE_ENV === "development",
        name: "debug",
        indexPath: path.join(__dirname, "services/debug/index.js")
    }
];
```

## Related

- [HubMemo](https://github.com/azu/hubmemo) support same directory structure
