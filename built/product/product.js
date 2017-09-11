"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const showdown_1 = require("showdown");
const getDirStat = (dir) => {
    let s;
    try {
        s = fs_1.lstatSync(dir);
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
        fs_1.readdirSync(dirF)
            .filter(d => getDirStat(path_1.join(dirF, d)) === 'dir')
            .forEach(d => loopDir(path_1.join(dirF, d), path_1.join(dirT, d)));
    }
}
function copyR(dirF, dirT) {
    if (getDirStat(dirF) !== 'dir')
        throw new Error('source dir is not a directory');
    mkDirLoop(dirT);
    fs_1.readdirSync(dirF).forEach(d => {
        let source = path_1.join(dirF, d), target = path_1.join(dirT, d);
        if (getDirStat(source) === 'dir') {
            mkDirLoop(target);
            copyR(source, target);
        }
        else {
            fs_1.writeFileSync(target, fs_1.readFileSync(source));
        }
    });
}
function mkDirLoop(dir) {
    if (getDirStat(dir) === null) {
        mkDirLoop(path_1.dirname(dir));
        fs_1.mkdirSync(dir);
    }
}
function writeReadmeToHtml(dir) {
    let converter = new showdown_1.Converter();
    let content = fs_1.readFileSync(path_1.join(dir, 'README.md'), 'utf8');
    content = converter.makeHtml(content);
    let indexPath = path_1.join(dir, 'index.html');
    fs_1.readFile(indexPath, 'utf8', (err, d) => {
        let index = d.indexOf('<script ');
        let all = d.slice(0, index) + content + d.slice(index);
        fs_1.writeFile(indexPath, all, 'utf8', err => {
            if (err)
                throw err;
        });
    });
}
function isProject(dir) {
    if (getDirStat(dir) !== 'dir')
        return false;
    try {
        fs_1.accessSync(path_1.join(dir, 'README.md'));
        fs_1.accessSync(path_1.join(dir, 'index.html'));
    }
    catch (e) {
        return false;
    }
    return true;
}
module.exports = { loopDir };
