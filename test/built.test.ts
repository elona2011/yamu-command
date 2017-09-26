import { resolve } from 'path'
import { expect } from 'chai'

import { getDirFrom, getDirTo } from '../src/bin/script/built'

describe('Script built:', () => {
    it('default dirFrom === src', () => {
        const result = getDirFrom()
        expect(result).to.equal(resolve(process.cwd(), 'src'))
    })
    it('default dirTo === built', () => {
        const result = getDirTo('')
        expect(result).to.equal(resolve(process.cwd(), 'built'))
    })
})