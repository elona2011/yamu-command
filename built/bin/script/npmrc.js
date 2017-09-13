"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
module.exports = function () {
    let home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    let rc = fs_1.readFileSync(path_1.resolve(home, '.npmrc'), 'utf8');
    let rc1 = fs_1.readFileSync(path_1.resolve(home, '.npmrc1'), 'utf8');
    fs_1.writeFileSync(path_1.resolve(home, '.npmrc'), rc1);
    fs_1.writeFileSync(path_1.resolve(home, '.npmrc1'), rc);
};
