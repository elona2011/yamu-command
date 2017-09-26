import { expect } from 'chai'
import { readFileSync, unlinkSync, existsSync } from 'fs'
import { resolve } from 'path'

import { parseCss } from '../src/bin/script/pcss'

let pcssPath = resolve(__dirname, './source/a.pcss'),
    cssPath = resolve(__dirname, './source/a.css')

describe('pcss test:', () => {
    it('can parse a simple pcss file', async function () {
        if (existsSync(cssPath)) {
            unlinkSync(cssPath)
        }
        await parseCss(pcssPath)
        let css = readFileSync(cssPath, 'utf8')
        expect(css).to.have.lengthOf.above(1)
    })
})