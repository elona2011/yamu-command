#!/usr/bin/env node

import * as program from 'commander'
import { pcss } from './script/pcss'
import { built } from './script/built'
import { serverInit } from './script/server'
import { tpl } from './script/tpl'
import { npmrc, changeNode } from './script/speed'
import { copyMul, rmGlob } from './script/shell'

/**
 * change nodejs version
 */
program
    .command('nodejs')
    .action(() => {
        changeNode()
    })

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
    .action((dir: string, options: { watch: string, file: string }) => {
        pcss(dir, options)
    })

/**
 * produce the production code
 */
program
    .command('built [dir]')
    .action((dir: string) => {
        built(dir)
    })

/**
 * start a development server
 */
program
    .command('server [dir]')
    .option('-d, --dir <dir>')
    .option('-p, --port <port>')
    .action((dir: string, options: { port: number, dir: string }) => {
        serverInit(dir, options)
    })

/**
 * copy template to the given path
 */
program
    .command('tpl [dir]')
    .action((dir: string) => {
        tpl(dir)
    })

/**
* copy file
*/
program
    .command('copy <src> <dest> [dir...]')
    .action((src: string, dest: string, dir: string[]) => {
        copyMul(src, dest, ...dir)
    })

/**
 * delete directory
 */
program
    .command('rm <dir>')
    .action(async (dir: string) => {
        await rmGlob(dir)
    })

program
    .option('-v, --version')

program.parse(process.argv)

if (program.version) {
    let version = require('../../../package.json').version
    console.log(version)
}