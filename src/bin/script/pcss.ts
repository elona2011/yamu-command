import { readFile, writeFileSync } from 'fs'
import { join, resolve, basename, dirname } from 'path'
import * as postcss from 'postcss'
import * as chokidar from 'chokidar'

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

        dir = resolve(process.cwd(), dir, '**/*.pcss')
        chokidar.watch(dir)
            .on('change', async function (p: string) {
                await parseCss(p)
            })
    } else if (file) {
        dir = file

        dir = join(process.cwd(), dir)
        await parseCss(dir)
    } else if (dir) {
        await parseCss(dir)
    }
}

/**
 * 
 * @param dir any path ended with .pcss
 */
async function parseCss(dir: string): Promise<void> {
    let fileName = basename(dir, '.pcss'),
        filePath = dirname(dir)

    log('parsing pcss file "' + dir + '" ...')
    await new Promise((res, rej) => {
        readFile(dir, (err, css) => {
            if (err) rej()

            postcss([cssnext])
                .process(css, {
                    from: dir,
                    to: join(filePath, fileName + '.css')
                })
                .then((result: any) => {
                    writeFileSync(join(filePath, fileName + '.css'), result.css);
                    if (result.map)
                        writeFileSync(join(filePath, fileName + '.css.map'), result.map);
                    log('parsing pcss file success!')
                    res()
                });
        });
    })
}

export { pcss, parseCss }