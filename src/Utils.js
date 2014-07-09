var fs = require('fs'),
    _ = require('underscore');

module.exports = {
    copy: function (destination, source) {
        for (var k in source) {
            if (source[k] !== null && typeof source[k] === 'object') {
                if (destination[k] === undefined) {
                    if (Object.prototype.toString.call(source[k]) !== "[object Array]") {
                        destination[k] = {};
                    } else {
                        destination[k] = [];
                    }

                }
                destination[k] = this.copy(destination[k], source[k]);
                continue;
            }
            destination[k] = source[k];
        }


        if (arguments.length < 3) {
            return destination;
        }

        var args = [destination];
        var i = 2;
        while (i < arguments.length) {
            args.push(arguments[i]);
            i++;
        }

        return this.copy.apply(this, args);
    },

    isClient: function () {
        return (typeof(window) !== 'undefined');
    },

    getFiles: function (dirList) {
        function findFiles (dirList, fileList) {
            if (dirList.length === 0) {
                return fileList;
            }

            var head = dirList.shift();
            var stats = fs.statSync(head);
            if (stats.isFile()) {
                fileList.push(head);
            } else {
                var files = fs.readdirSync(head);
                files = _.map(files, function (file) {
                    return head + '/' + file;
                });
                dirList = files.concat(dirList);
            }

            return findFiles(dirList, fileList);
        }

        return findFiles(dirList, []);
    },

    inherits: function (child, parent) {
        var Tmp = function () {};
        Tmp.prototype = parent.prototype;
        child.prototype = new Tmp();
        child.prototype.constructor = child;
    },

    toSeconds: function (time) {
        return Math.round(time / 1000);
    },

    toMinutes: function (time) {
        return Math.round(this.toSeconds(time) / 60);
    },

    toAbsolute: function (basePath, relativePath) {
        var path = basePath.split('/');
        var relativeArray = relativePath.split('/');

        if (relativeArray[0] === '') {
            return relativeArray.join('/');
        }

        for (var i in relativeArray) {
            if (relativeArray[i] === '.') {
                continue;
            }

            if (relativeArray[i] === '..') {
                var item = path.pop();
                if (item === undefined) {
                    throw new Error('Already at top of Path!');
                }
            } else {
                path.push(relativeArray[i]);
            }
        }
        return path.join('/');
    },

    /**
     * Converts currency to a formatted string (eg. "$2.50")
     * @param type
     * @param amount
     * @returns string
     */
    formatCurrency: function (type, amount) {
        var formatted;

        switch (type) {
            case 'usd':
                formatted = '$' + (amount / 100);
                break;

            default:
                formatted = (amount / 100) + ' (' + type + ')';
                break;
        }

        return formatted;
    }
};
