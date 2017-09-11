#!/usr/bin/env node
const { resolve } = require('path');
const program = require('commander');
const { loopDir } = require('../src/product/product');
let dirFrom = resolve(process.cwd(), process.env.npm_package_config_product_from || 'browser');
program
    .option('-d, --dir <dir>')
    .parse(process.argv);
if (program.dir) {
    dirFrom = resolve(process.cwd(), program.dir);
}
console.log('starting compile product folder "' + dirFrom + '" ...');
loopDir(dirFrom, resolve(process.cwd(), 'www'));
