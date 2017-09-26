import { existsSync, readFileSync } from 'fs'
import { resolve, join } from 'path'
import { expect } from 'chai'
import { copyGlob, copyRf, rmGlob, rmRf, getAddedPath } from '../src/bin/script/shell'

describe('shell test:', () => {
    it('getAddedPath in linux', () => {
        let path = getAddedPath('a/b/c/**', 'a/b/c/d/e')
        expect(path).to.equal('d/e')
    })

    it('getAddedPath in windows', () => {
        let path = getAddedPath('c:\\Users\\Documents\\git\\yamu-template\\test\\source\\copysrc\\**', 'c:\\Users\\Documents\\git\\yamu-template\\test\\source\\copysrc\\copytest')
        expect(path).to.equal('copytest')
    })

    it('del a directory success', async () => {
        let dest = resolve(__dirname, './source/copydest'),
            src = resolve(__dirname, './source/copysrc/**'),
            copytest

        await rmRf(dest)
        await copyGlob(src, dest)
        await rmRf(dest)

        expect(existsSync(dest)).to.equal(false)
    })

    it('copy a file(absolute path) success', async () => {
        let dest = resolve(__dirname, './source/copydest'),
            src = resolve(__dirname, './source/copysrc/**'),
            copytestPath = resolve(dest, 'copytest'),
            copytest

        await rmRf(dest)
        await copyGlob(src, dest)
        if (existsSync(copytestPath)) {
            copytest = readFileSync(copytestPath, 'utf8')
        }
        expect(copytest).to.equal('abc')
    })

    it('copy a file(absolute path) success', async () => {
        let dest = resolve(__dirname, './source/copydest'),
            src = resolve(__dirname, './source/copysrc/**/*'),
            copytestPath = resolve(dest, 'copytest'),
            copytest

        await rmRf(dest)
        await copyRf(src, dest)
        if (existsSync(copytestPath)) {
            copytest = readFileSync(copytestPath, 'utf8')
        }
        expect(copytest).to.equal('abc')
    })

    it('copy a file(relative path) success', async () => {
        let dest = './source/copydest',
            src = './source/copysrc/**',
            copytestPath = resolve(__dirname, dest, 'copytest'),
            copytest

        await rmGlob(dest + '/**')
        await copyGlob(src, dest)
        if (existsSync(copytestPath)) {
            copytest = readFileSync(copytestPath, 'utf8')
        }
        expect(copytest).to.equal('abc')
    })
})