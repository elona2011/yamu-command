import { resolve, sep, dirname } from 'path'
import { existsSync, stat, mkdirSync, rmdirSync, createWriteStream, createReadStream, unlinkSync } from 'fs'
import * as glob from 'glob'
import { log } from '../../common/output'
import { getFileTo } from '../../common/common'

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
                await new Promise((res1, rej1) => {
                    stat(n, (err, stats) => {
                        let copyDest = getFileTo(n, getGlobBase(src), dest)
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

/**
 * 
 * @param path should be a file path
 */
function makeDirRecursive(path: string): void {
    let dir = dirname(path)
    if (!existsSync(dir)) {
        makeDirRecursive(dir)
        mkdirSync(dir)
    }
}

function getGlobBase(pattern: string): string {
    if (!glob.hasMagic(pattern)) {
        throw new Error('not Glob pattern')
    }
    if (!pattern.length) {
        throw new Error('pattern could not be empty')
    }

    let arr = pattern.split(sep),
        base = arr.shift() || ''
    for (let n of arr) {
        if (n.match(/\*/)) {
            break
        } else {
            base += sep + n
        }
    }
    return base
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

export { copyMul, copyGlob, copyRf, rmGlob, rmRf, getGlobBase, makeDirRecursive }