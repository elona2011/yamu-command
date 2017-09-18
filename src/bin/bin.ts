#!/usr/bin/env node

import * as program from 'commander'
import { pcss } from './script/pcss'
import { built } from './script/built'
import { beforeServer } from './script/server'
import { tpl } from './script/tpl'
import { npmrc, changeNode } from './script/speed'
import { copy, rm } from './script/shell'

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
    .action((dir: Dir, options: { watch: string, file: string }) => {
        pcss(dir, options)
    })

/**
 * produce the production code
 */
program
    .command('built [dir]')
    .action((dir: Dir) => {
        built(dir)
    })

/**
 * start a development server
 */
program
    .command('server [dir]')
    .option('-d, --dir <dir>')
    .option('-p, --port <port>')
    .action((dir: Dir, options: { port: number, dir: string }) => {
        beforeServer(dir, options)
    })

/**
 * copy template to the given path
 */
program
    .command('tpl [dir]')
    .action((dir: Dir) => {
        tpl(dir)
    })

/**
* copy file
*/
program
    .command('copy <src> <dest> [dir...]')
    .action((src: Dir, dest: Dir, dir: Dir[]) => {
        copy(src, dest, ...dir)
    })

/**
 * delete directory
 */
program
    .command('rm <dir>')
    .action((dir: Dir) => {
        rm(dir)
    })

program.parse(process.argv)