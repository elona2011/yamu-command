import { spawn } from 'child_process'
import { resolve } from 'path'

import { copy, rm } from './shell'
import Output from '../../common/output'
import { cmdName } from '../../common/common'

let output = new Output(__filename)

function built(dir: Dir) {
    let dirFrom = getDirFrom(),
        dirTo = getDirTo(dir)

    output.log('delete built folder: ' + dirTo)
    rm(dirTo)
    copy('src/**/*.!(js*)', 'built/')

    //run tsc commandline
    let tsc = cmdName('tsc'),
        child = spawn(tsc)

    child.on('error', err => {
        output.log(`${err}`)
    })
    child.on('close', code => {
        output.log(`tsc exited with code ${code}`)
    })
    child.stdout.pipe(process.stdout)
}

function getDirFrom(): string {
    return resolve(process.cwd(), process.env.npm_package_config_product_from || 'src')
}

function getDirTo(dir: Dir): string {
    let dirTo = resolve(process.cwd(), process.env.npm_package_config_product_to || 'built')
    if (dir) {
        dirTo = resolve(process.cwd(), dir)
    }
    return dirTo
}

export { built, getDirFrom, getDirTo }