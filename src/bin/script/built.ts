import { spawn } from 'child_process'
import { resolve } from 'path'

import { copyMul, rmRf } from './shell'
import { log } from '../../common/output'
import { cmdName } from '../../common/common'

async function built(dir: string) {
    let dirFrom = getDirFrom(),
        dirTo = getDirTo(dir)

    log('delete built folder: ' + dirTo)
    await rmRf(dirTo)
    copyMul('src/**/*!(.ts)', 'built/')

    //run tsc commandline
    let tsc = cmdName('tsc'),
        child = spawn(tsc)

    child.on('error', err => {
        log(`${err}`)
    })
    child.on('close', code => {
        log(`tsc exited with code ${code}`)
    })
    child.stdout.pipe(process.stdout)
}

function getDirFrom(): string {
    return resolve(process.cwd(), process.env.npm_package_config_product_from || 'src')
}

function getDirTo(dir: string): string {
    let dirTo = resolve(process.cwd(), process.env.npm_package_config_product_to || 'built')
    if (dir) {
        dirTo = resolve(process.cwd(), dir)
    }
    return dirTo
}

export { built, getDirFrom, getDirTo }