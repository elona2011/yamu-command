import { spawn } from 'child_process'
import { resolve, join, relative } from 'path'
import { readFile, writeFile } from 'fs'
import { copyMul, rmRf, makeDirRecursive } from './fs'
import { log } from '../../common/output'
import { cmdName, editJsonFile, getDirFrom, getDirTo, getFileTo } from '../../common/common'
import * as ts from 'typescript'
import * as glob from 'glob'

let tsconfig = require(resolve('tsconfig.json'))

async function built(dirFrom?: string, dirTo?: string) {
    let dirToAbs = getDirTo(dirTo),
        dirFromAbs = getDirFrom(dirFrom)

    log('delete built folder:', dirToAbs)
    await rmRf(dirToAbs)
    await copyMul(join(dirFromAbs, '/**/!(*.ts)'), dirToAbs)

    glob(join(dirFromAbs, '**/*.ts'), (err, matches) => {
        for (let n of matches) {
            let dest = getFileTo(n, dirFromAbs, dirToAbs, '.js')
            readFile(n, 'utf8', (err, data) => {
                let result = ts.transpileModule(data, tsconfig.compilerOptions)
                makeDirRecursive(n)
                writeFile(dest, result.outputText, err => { if (err) throw err })
            })
        }
    })
    //modify tsconfig.json
    // try {
    //     await editJsonFile(resolve(process.cwd(), 'tsconfig.json'), ['include'], [join(dirFrom || dirFromDef, '**/*')])
    //     await editJsonFile(resolve(process.cwd(), 'tsconfig.json'), ['compilerOptions', 'outDir'], dirTo || dirToDef)
    // } catch (error) {
    //     console.error(error)
    // }

    // //run tsc commandline
    // let tsc = cmdName('tsc'),
    //     child = spawn(tsc)

    // child.on('error', err => {
    //     log(`${err}`)
    // })
    // child.on('close', code => {
    //     log(`tsc exited with code ${code}`)
    // })
    // child.stdout.pipe(process.stdout)
}

export { built }