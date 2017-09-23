import { join } from 'path'
import { copySync, removeSync } from 'fs-extra'
import * as glob from 'glob'
import {log} from '../../common/output'

function copy(src: Dir, dest: Dir, ...dir: Dir[]) {
    if (dir.length) {
        copySrc(src, dir[dir.length - 1])
        copySrc(dest, dir[dir.length - 1])
        for (let i = 0; i <= dir.length - 2; i++) {
            copySrc(dir[i], dir[dir.length - 1])
        }
    } else {
        copySrc(src, dest)
    }

    function copySrc(src: Dir, dest: Dir) {
        glob.sync(src).forEach(n => {
            log(n)
            copySync(n, join(dest, n.slice(n.indexOf('/'))))
        })
    }
}

function rm(dir: Dir) {
    glob.sync(dir).forEach(n => {
        log(n)
        removeSync(n)
    })
    log('rm dir: ' + dir)
}

export { copy, rm }