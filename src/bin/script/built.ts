import { spawn } from 'child_process'
import { resolve, join } from 'path'

import { copyMul, rmRf } from './shell'
import { log } from '../../common/output'
import { cmdName, editJsonFile } from '../../common/common'

let dirFromDef = 'src',
    dirToDef = 'built'

async function built(dirFrom: string, dirTo: string) {
    let dirToAbs = getDirTo(dirTo)

    log('delete built folder:', dirToAbs)
    await rmRf(dirToAbs)
    copyMul('src/**/!(*.ts)', 'built/')

    //modify tsconfig.json
    try {
        await editJsonFile(resolve(process.cwd(), 'tsconfig.json'), ['include'], [join(dirFrom || dirFromDef, '**/*')])
        await editJsonFile(resolve(process.cwd(), 'tsconfig.json'), ['compilerOptions', 'outDir'], dirTo || dirToDef)
    } catch (error) {
        console.error(error)
    }

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

function getDirFrom(dirFrom: string): string {
    return resolve(process.cwd(), dirFrom || process.env.npm_package_config_product_from || dirFromDef)
}

function getDirTo(dirTo: string): string {
    return resolve(process.cwd(), dirTo || process.env.npm_package_config_product_to || dirToDef)
}

export { built, getDirFrom, getDirTo }