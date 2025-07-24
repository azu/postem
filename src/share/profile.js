// LICENSE : MIT
import { remote } from "@electron/remote";

export function start() {
    global.profile_startTime = Date.now();
}

export function stop() {
    var ms = Date.now() - remote.getGlobal("profile_startTime");
    console.log("profile", ms + "ms");
}
