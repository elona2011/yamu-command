import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { expect } from 'chai'
import { copyGlob, rmGlob } from '../src/bin/script/shell'

describe('shell test', () => {
    it('copy a file success', async () => {
        let dest = resolve(__dirname, './source/copydest'),
            src = resolve(__dirname, './source/copysrc/**'),
            copytestPath = resolve(dest, 'copytest'),
            copytest

        await rmGlob(dest + '/**')
        await copyGlob(src, dest)
        if (existsSync(copytestPath)) {
            copytest = readFileSync(copytestPath,'utf8')
        }
        expect(copytest).to.equal('abc')
    })
})