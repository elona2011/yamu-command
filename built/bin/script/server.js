"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const opn = require('opn');
const spawn = require('child_process').spawn;
const server = require('../../server/server');
module.exports = function (dir, program) {
    let port = 9000;
    if (!dir) {
        dir = path.resolve(process.cwd(), process.env.npm_package_config_dir || '');
    }
    if (program.port) {
        port = program.port;
    }
    if (program.dir) {
        dir = path.resolve(process.cwd(), program.dir);
    }
    console.log('watching css file at', dir, '...');
    if (process.platform === 'win32') {
        var cmd = 'npm.cmd';
    }
    else {
        var cmd = 'npm';
    }
    const pcss = spawn(cmd, ['run', 'pcss', '--', '-w', dir]);
    pcss.stdout.on('data', (d) => {
        //输出无空行
        process.stdout.write(`pcss: ${d}`);
        //输出有空行
        // console.log(`pcss: ${d}`)
    });
    console.log('starting server at', dir, '...');
    server(dir, port);
    opn('http://localhost:' + port);
};
