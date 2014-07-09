var _ = require('underscore');
var fs = require('fs');

var NodeUtils = function () {
};

_.extend(NodeUtils, {
    copyFile: function (fromPath, toPath, callback) {
        var inputFile = fs.createReadStream(fromPath);
        var outputFile = fs.createWriteStream(toPath);

        inputFile.pipe(outputFile);

        inputFile.on('error', function (err) {
            callback(err, undefined);
        });

        inputFile.on('end', function () {
            callback(undefined, toPath);
        });

        outputFile.on('error', function (err) {
            callback(err, undefined);
        });
    },
    moveFile: function (fromPath, toPath, callback) {
        this.copyFile(fromPath, toPath, function (err, toPath) {
            if (err) {
                return callback(err, toPath);
            }
            fs.unlink(fromPath, function (err) {
                callback(err, toPath);
            });
        });
    }
});

module.exports = NodeUtils;