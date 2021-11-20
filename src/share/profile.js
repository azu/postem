// LICENSE : MIT
"use strict";
exports.start = function() {
    global.profile_startTime = Date.now();
};
exports.stop = function() {
    var ms = Date.now() - require('@electron/remote').getGlobal("profile_startTime");
    console.log("profile", ms + "ms");
};
