var fs = require("fs");
var http = require('https');
var path = require("path");
exports.load = function () {
    return require("technical-word-rules");
};
exports.save = function (newDict) {
    var serialized = JSON.stringify(newDict);
    var allJSONPath = path.join(path.dirname(require.resolve("technical-word-rules")), "all.json");
    fs.writeFileSync(allJSONPath, serialized, "utf-8");
};
exports.getDictionary = function (callback) {
    var url = 'https://azu.github.io/technical-word-rules/all.json';
    http.get(url, function (res) {
        var body = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var ret = JSON.parse(body);
            callback(null, ret);
        });
    }).on('error', function (e) {
        callback(e);
    });
};