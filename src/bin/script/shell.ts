import { join } from 'path'
import { copySync, removeSync } from 'fs-extra'
import * as glob from 'glob'
import Output from '../../output/output'

let output = new Output(__filename)

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
            output.log(n)
            output.log('1 ' + dest)
            output.log('2 ' + join(dest, n.slice(n.indexOf('/'))))
            copySync(n, join(dest, n.slice(n.indexOf('/'))))
        })
    }
}

function rm(dir: Dir) {
    glob.sync(dir).forEach(n => {
        output.log(n)
        removeSync(n)
    })
    output.log('rm dir: ' + dir)
}

export { copy, rm }