import { expect } from 'chai'

import { getCallerFileName, getPathFromStack } from '../src/common/output'

describe('common test:', () => {
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