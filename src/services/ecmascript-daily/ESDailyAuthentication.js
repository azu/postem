// Deprecated: Authentication is no longer needed
// Configuration is now passed via service options

exports.canAccess = function () {
    // Always return true since config is in service options
    return true;
};

exports.requireAccess = function (callback) {
    // No authentication needed, config is in service options
    callback();
};
