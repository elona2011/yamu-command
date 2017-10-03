import { resolve } from 'path'
import { readFileSync } from 'fs'
import { expect } from 'chai'
import { editJsonFile, getDirFrom, getDirTo, getFileTo } from '../src/common/common'
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

    it('default dirFrom === src', () => {
        const result = getDirFrom('')
        expect(result).to.equal(resolve(process.cwd(), 'src'))
    })
    it('default dirTo === built', () => {
        const result = getDirTo('')
        expect(result).to.equal(resolve(process.cwd(), 'built'))
    })
    it('getFileTo (file in the dirctory)', () => {
        const result = getFileTo('/home/a/b', '/home/a', '/home/b/c')
        expect(result).to.equal('/home/b/c/b')
    })
    it('getFileTo (file with extension)', () => {
        const result = getFileTo('/home/a/b.ts', '/home/a', '/home/b/c','.js')
        expect(result).to.equal('/home/b/c/b.js')
    })
    it('getFileTo (file is not in the dirctory)', () => {
        expect(getFileTo.bind(null, '/home/a/b', '/home/c', '/home/b/c'))
            .to.throw('file is not in the directory')
    })
})