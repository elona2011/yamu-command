import { readFile, writeFileSync, stat } from 'fs'
import { join, resolve, basename, dirname } from 'path'
import * as postcss from 'postcss'
import * as chokidar from 'chokidar'
import { makeDirRecursive } from './fs'

const cssnext = require("postcss-cssnext")

import { log } from '../../common/output'

/**
 * 
 * @param dir not available now
 * @param options {watch: any directory, file: any path ended with .pcss}
 */
async function pcss({ watch, file, dir }: { watch?: string, file?: string, dir?: string }) {
    if (watch) {
        dir = watch

        log('watching pcss file ' + dir)

        dir = resolve(dir, '**/*.pcss')
        chokidar.watch(dir)
            .on('change', async function (p: string) {
                await parseCss(p)
            })
    } else if (file) {
        dir = file

        dir = resolve(dir)
        await parseCss(dir)
    } else if (dir) {
        await parseCss(dir)
    }
}

/**
 * 
 * @param fileFrom absolute path ended with .pcss
 * @param dirTo dest dir 
 */
async function parseCss(fileFrom: string, dirTo?: string): Promise<void> {
    let fileName = basename(fileFrom, '.pcss'),
        destDir = dirTo ? dirTo : dirname(fileFrom),
        destFile = resolve(destDir, fileName + '.css')

    await new Promise((res, rej) => {
        stat(destDir, (err, stats) => {
            if (err) {
                makeDirRecursive(destFile)
            } else if (!stats.isDirectory()) {
                throw new Error('filePath is not a directory')
            }
            res()
        })
    })

    log('parsing pcss file "' + fileFrom + '" ...')
    await new Promise((res, rej) => {
        readFile(fileFrom, (err, css) => {
            if (err) rej()

            postcss([cssnext])
                .process(css, {
                    from: fileFrom,
                    to: destFile
                })
                .then((result: any) => {
                    writeFileSync(destFile, result.css);
                    if (result.map)
                        writeFileSync(resolve(destDir, fileName + '.css.map'), result.map);
                    log('parsing pcss file success!')
                    res()
                });
        });
    })
}

export { pcss, parseCss }