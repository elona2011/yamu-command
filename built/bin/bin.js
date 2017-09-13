#!/usr/bin/env node
const program = require('commander');
const pcss = require('./script/pcss');
const product = require('./script/product');
const server = require('./script/server');
const tpl = require('./script/tpl');
const npmrc = require('./script/npmrc');
/**
 * change .npmrc file
 */
program
    .command('npmrc')
    .action(() => {
    npmrc();
});
/**
 * postCss
 */
program
    .command('pcss [dir]')
    .option('-w, --watch <dir>')
    .option('-f, --file <file>')
    .action((dir, options) => {
    pcss(dir, options);
});
/**
 * produce the production code
 */
program
    .command('product [dir]')
    .action((dir) => {
    product(dir);
});
/**
 * start a development server
 */
program
    .command('server [dir]')
    .option('-d, --dir <dir>')
    .option('-p, --port <port>')
    .action((dir, options) => {
    server(dir, options);
});
/**
 * copy template to the given path
 */
program
    .command('tpl [dir]')
    .action((dir) => {
    tpl(dir);
});
program.parse(process.argv);
