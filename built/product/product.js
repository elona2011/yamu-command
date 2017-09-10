var _a = require('fs'), readFileSync = _a.readFileSync, writeFileSync = _a.writeFileSync, readFile = _a.readFile, writeFile = _a.writeFile, accessSync = _a.accessSync, lstatSync = _a.lstatSync, readdirSync = _a.readdirSync, mkdirSync = _a.mkdirSync, createReadStream = _a.createReadStream, createWriteStream = _a.createWriteStream;
var _b = require('path'), join = _b.join, dirname = _b.dirname;
var Converter = require('showdown').Converter;
var getDirStat = function (dir) {
    var s;
    try {
        s = lstatSync(dir);
    }
    catch (e) {
        return null;
    }
    if (s.isDirectory())
        return 'dir';
    if (s.isFile())
        return 'file';
};
function loopDir(dirF, dirT) {
    if (getDirStat(dirF) !== 'dir')
        throw new Error('dir is not a directory');
    if (isProject(dirF)) {
        copyR(dirF, dirT);
        writeReadmeToHtml(dirT);
    }
    else {
        readdirSync(dirF)
            .filter(function (d) { return getDirStat(join(dirF, d)) === 'dir'; })
            .forEach(function (d) { return loopDir(join(dirF, d), join(dirT, d)); });
    }
}
function copyR(dirF, dirT) {
    if (getDirStat(dirF) !== 'dir')
        throw new Error('source dir is not a directory');
    mkDirLoop(dirT);
    readdirSync(dirF).forEach(function (d) {
        var source = join(dirF, d), target = join(dirT, d);
        if (getDirStat(source) === 'dir') {
            mkDirLoop(target);
            copyR(source, target);
        }
        else {
            writeFileSync(target, readFileSync(source));
        }
    });
}
function mkDirLoop(dir) {
    if (getDirStat(dir) === null) {
        mkDirLoop(dirname(dir));
        mkdirSync(dir);
    }
}
function writeReadmeToHtml(dir) {
    var converter = new Converter();
    var content = readFileSync(join(dir, 'README.md'), 'utf8');
    content = converter.makeHtml(content);
    var indexPath = join(dir, 'index.html');
    readFile(indexPath, 'utf8', function (err, d) {
        var index = d.indexOf('<script ');
        var all = d.slice(0, index) + content + d.slice(index);
        writeFile(indexPath, all, 'utf8', function (err) {
            if (err)
                throw err;
        });
    });
}
function isProject(dir) {
    if (getDirStat(dir) !== 'dir')
        return false;
    try {
        accessSync(join(dir, 'README.md'));
        accessSync(join(dir, 'index.html'));
    }
    catch (e) {
        return false;
    }
    return true;
}
module.exports = { loopDir: loopDir };
