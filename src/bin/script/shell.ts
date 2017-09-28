import { resolve } from 'path'
import { existsSync, stat, mkdirSync, rmdirSync, createWriteStream, createReadStream, unlinkSync } from 'fs'
import * as glob from 'glob'
import { log } from '../../common/output'

/**
 * 
 * @param src 
 * @param dest 
 * @param dir 
 */
async function copyMul(src: string, dest: string, ...dir: string[]) {
    if (dir.length) {
        await copyRf(src, dir[dir.length - 1])
        await copyRf(dest, dir[dir.length - 1])
        for (let i = 0; i <= dir.length - 2; i++) {
            await copyRf(dir[i], dir[dir.length - 1])
        }
    } else {
        await copyRf(src, dest)
    }
}

async function copyRf(src: string, dest: string): Promise<void> {
    src = resolve(src)
    dest = resolve(dest)

    if (!existsSync(dest)) {
        mkdirSync(dest)
    }
    await copyGlob(src, dest)
}

/**
 * copy files using glob pattern
 * @param src glob pattern
 * @param dest path
 */
async function copyGlob(src: string, dest: string): Promise<void> {
    await new Promise((res, rej) => {
        src = resolve(src)
        dest = resolve(dest)

        glob(src, async (err, matches) => {
            for (let n of matches) {
                let samePath = getAddedPath(src, n)
                await new Promise((res1, rej1) => {
                    stat(n, (err, stats) => {
                        let copyDest = resolve(dest, samePath)
                        log('copy:', n, 'to', copyDest)
                        if (stats.isDirectory()) {
                            if (!existsSync(copyDest)) {
                                mkdirSync(copyDest)
                            }
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

function getAddedPath(src: string, curSrc: string): string {
    let baseSrc,
        r = /([^*]+)\*/.exec(src)

    if (r && r.length) {
        baseSrc = r[1]
    } else {
        return ''
    }

    let path = curSrc.slice(baseSrc.length)
    return path
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

async function rmRf(dir: string): Promise<any> {
    await rmGlob(dir + '/**')
}

export { copyMul, copyGlob, copyRf, rmGlob, rmRf, getAddedPath }