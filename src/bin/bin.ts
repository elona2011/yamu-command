#!/usr/bin/env node

const program = require('commander')

const pcss = require('./script/pcss')
const product = require('./script/product')
const server = require('./script/server')
const tpl = require('./script/tpl')
const npmrc = require('./script/npmrc')

/**
 * change .npmrc file
 */
program
    .command('npmrc')
    .action(() => {
        npmrc()
    })

/**
 * postCss
 */
program
    .command('pcss [dir]')
    .option('-w, --watch <dir>')
    .option('-f, --file <file>')
    .action((dir: Dir, options: { watch: string, file: string }) => {
        pcss(dir, options)
    })

/**
 * produce the production code
 */
program
    .command('product [dir]')
    .action((dir: Dir) => {
        product(dir)
    })

/**
 * start a development server
 */
program
    .command('server [dir]')
    .option('-d, --dir <dir>')
    .option('-p, --port <port>')
    .action((dir: Dir, options: { watch: string, file: string }) => {
        server(dir, options)
    })

/**
 * copy template to the given path
 */
program
    .command('tpl [dir]')
    .action((dir: Dir) => {
        tpl(dir)
    })

program.parse(process.argv)