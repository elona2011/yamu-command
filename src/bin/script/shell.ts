import { join } from 'path'
import { stat, mkdirSync, rmdirSync, createWriteStream, createReadStream, unlinkSync } from 'fs'
import * as glob from 'glob'
import { log } from '../../common/output'

async function copyMul(src: string, dest: string, ...dir: string[]) {
    if (dir.length) {
        await copyGlob(src, dir[dir.length - 1])
        await copyGlob(dest, dir[dir.length - 1])
        for (let i = 0; i <= dir.length - 2; i++) {
            await copyGlob(dir[i], dir[dir.length - 1])
        }
    } else {
        await copyGlob(src, dest)
    }
}

/**
 * 
 * @param src should be absolute path
 * @param dest should be absolute path
 */
async function copyGlob(src: string, dest: string): Promise<void> {
    await new Promise((res, rej) => {
        let basesrc: string

        glob(src, async (err, matches) => {
            if (matches.length) {
                basesrc = matches[0]
            }
            for (let n of matches) {
                let samePath = n.slice(basesrc.length)
                await new Promise((res1, rej1) => {
                    stat(n, (err, stats) => {
                        let copyDest = join(dest, samePath)
                        log('copy:', n, 'to', copyDest)
                        if (stats.isDirectory()) {
                            mkdirSync(copyDest)
                            res1()
                        } else {
                            createReadStream(n)
                                .pipe(createWriteStream(copyDest))
                                .on('close', () => {
                                    res1()
                                })
                        }
                    })
                })
            }
            res()
        })
    })
}

async function rmGlob(dir: string): Promise<any> {
    return new Promise((res, rej) => {
        log('starting rm dir:', dir)
        glob(dir, async (err, matches) => {
            if (err) {
                log(err)
                rej()
            }

            for (let n of matches.reverse()) {
                log('rm:', n)
                await new Promise((res1, rej1) => {
                    stat(n, (err, stats) => {
                        if (stats.isDirectory()) {
                            rmdirSync(n)
                        } else {
                            unlinkSync(n)
                        }
                        res1()
                    })
                })
            }
            res()
        })
    })
}

export { copyMul, copyGlob, rmGlob }