import { expect } from 'chai'

import { getCallerFileName } from '../src/common/output'

describe('common test', () => {
    it('getCallerFileName === common.test.ts', () => {
        let output = getCallerFileName()
        expect(output).to.equal('common.test.ts')
    })
})