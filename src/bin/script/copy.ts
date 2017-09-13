let copyfiles = require('copyfiles')

module.exports = function (source: Dir, target: Dir[]) {
    copyfiles([source, ...target])
}