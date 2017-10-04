import { spawn } from 'child_process'
import { resolve, join, relative, dirname } from 'path'
import { readFile, writeFile } from 'fs'
import { copyMul, rmRf, makeDirRecursive } from './fs'
import { parseCss } from './pcss'
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
    await copyMul(join(dirFromAbs, '/**/!(*.ts|*.pcss)'), dirToAbs)

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

    glob(join(dirFromAbs, '**/*.pcss'), async (err, matches) => {
        for (let n of matches) {
            let dest = getFileTo(n, dirFromAbs, dirToAbs, '.css')
            await parseCss(n, dirname(dest))
        }
    })
}

export { built }