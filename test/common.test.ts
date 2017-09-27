import { resolve } from 'path'
import { readFileSync } from 'fs'
import { expect } from 'chai'
import { editJsonFile } from '../src/common/common'
import { getCallerFileName, getPathFromStack } from '../src/common/output'

describe('common test:', () => {
    it('edit json file value', async () => {
        let jsonPath = resolve(__dirname, 'source/tsconfig.json'),
            jsonData

        await editJsonFile(jsonPath, ['compilerOptions', 'outDir'], 'www')
        jsonData = require(jsonPath)
        expect(jsonData.compilerOptions.outDir).to.equal('www')
    })
    it('getPathFromStack running in windows', () => {
        let path = '    at callFn (c:\\Users\\Documents\\git\\yamu-template\\node_modules\\mocha\\lib\\runnable.js:348:21)'
        expect(getPathFromStack(path)).to.equal('c:\\Users\\Documents\\git\\yamu-template\\node_modules\\mocha\\lib\\runnable.js')
    })

    it('getPathFromStack running in linux', () => {
        let path = 'at Object.getCallerFileName (/home/aaa/bbb/cccc/output.ts:8:17)'
        expect(getPathFromStack(path)).to.equal('/home/aaa/bbb/cccc/output.ts')
    })

    it('getCallerFileName === common.test.ts', () => {
        let output = getCallerFileName()
        expect(output).to.equal('common.test.ts')
    })
})