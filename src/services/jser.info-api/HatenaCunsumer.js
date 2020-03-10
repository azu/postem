// LICENSE : MIT
"use strict";
const getConsumer = process.env.BROWSER === "1" ? () => {
    const url = new URL(location.href);
    return {
        github: {
            "owner": decodeURIComponent(url.searchParams.get("github.owner")),
            "repo": decodeURIComponent(url.searchParams.get("github.repo")),
            "ref": decodeURIComponent(url.searchParams.get("github.ref")),
            "token": decodeURIComponent(url.searchParams.get("github.token")),
        },
        "indexPropertyName": decodeURIComponent(url.searchParams.get("github.indexPropertyName"))
    }
} : () => {
    return require("./consumer")
};
export default getConsumer()
