import { spawn } from 'child_process'
import { resolve, join, relative, dirname, basename } from 'path'
import { readFile, writeFile } from 'fs'
import { copyMul, rmRf, makeDirRecursive } from './fs'
import { parseCss } from './pcss'
import { log } from '../../common/output'
import { cmdName, editJsonFile, getDirFrom, getDirTo, getFileTo } from '../../common/common'
import * as ts from 'typescript'
import * as glob from 'glob'

async function built(dirFrom?: string, dirTo?: string) {
    let dirToAbs = getDirTo(dirTo),
        dirFromAbs = getDirFrom(dirFrom),
        tsconfig: any

    try {
        tsconfig = require(resolve('tsconfig.json'))
    } catch (error) {
        log(error.message)
        log('use default tsconfig setting')
        tsconfig = {
            "compilerOptions": {
                "strictNullChecks": true,
                "module": "commonjs",
                "allowJs": false,
                "target": "es5",
                "outDir": "built",
                "lib": [
                    "es5",
                    "es6",
                    "dom"
                ],
                "noImplicitAny": true,
                "removeComments": true,
                "sourceMap": true
            }
        }
    }

    log('delete built folder:', dirToAbs)
    await rmRf(dirToAbs)
    await copyMul(join(dirFromAbs, '/**/!(*.ts|*.pcss)'), dirToAbs)

    glob(join(dirFromAbs, '**/*.ts'), (err, matches) => {
        for (let n of matches) {
            let destJs = getFileTo(n, dirFromAbs, dirToAbs, '.js'),
                destMap = getFileTo(n, dirFromAbs, dirToAbs, '.js.map')
            readFile(n, 'utf8', (err, data) => {
                tsconfig.fileName = relative(dirname(dirname(destMap)), n)
                let result = ts.transpileModule(data, tsconfig)
                makeDirRecursive(n)
                if (result.diagnostics && result.diagnostics.length) {
                    log('ts parse error:', result.diagnostics)
                }
                writeFile(destJs, result.outputText, err => { if (err) throw err })
                if (tsconfig.compilerOptions.sourceMap) {
                    writeFile(destMap, result.sourceMapText, err => { if (err) throw err })
                }
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