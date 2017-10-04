import { expect } from 'chai'
import { readFileSync, unlinkSync, existsSync } from 'fs'
import { resolve } from 'path'

import { rmRf } from '../src/bin/script/fs'
import { parseCss } from '../src/bin/script/pcss'

let pcssPath = resolve(__dirname, './source/a.pcss'),
    cssPath = resolve(__dirname, './source/a.css'),
    destDir = resolve(__dirname, 'source/a/'),
    destFile = resolve(destDir, 'a.css')

describe('pcss test:', () => {
    it('can parse a simple pcss file', async function () {
        if (existsSync(cssPath)) {
            unlinkSync(cssPath)
        }
        await parseCss(pcssPath)
        let css = readFileSync(cssPath, 'utf8')
        expect(css).to.have.lengthOf.above(1)
        unlinkSync(cssPath)
    })
    it('parseCss test dirTo', async function () {
        if (existsSync(cssPath)) {
            unlinkSync(cssPath)
        }
        await parseCss(pcssPath, destDir)
        let css = readFileSync(destFile, 'utf8')
        expect(css).to.have.lengthOf.above(1)
        await rmRf(destDir)
    })
})