// LICENSE : MIT
"use strict";
const url = new URL(location.href);
export default {
    "github": {
        "owner": decodeURIComponent(url.searchParams.get("github.owner")),
        "repo": decodeURIComponent(url.searchParams.get("github.repo")),
        "ref": decodeURIComponent(url.searchParams.get("github.ref")),
        "token": decodeURIComponent(url.searchParams.get("github.token")),
        "indexPropertyName": decodeURIComponent(url.searchParams.get("github.indexPropertyName"))
    }
}
