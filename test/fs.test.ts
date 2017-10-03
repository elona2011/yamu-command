import { existsSync, readFileSync } from 'fs'
import { resolve, join } from 'path'
import { expect } from 'chai'
import { copyGlob, copyRf, rmGlob, rmRf, getGlobBase, makeDirRecursive } from '../src/bin/script/fs'

describe('shell test:', () => {
    it('getGlobBase', () => {
        if (/^win/.test(process.platform)) {
            let path = getGlobBase('c:\\Users\\Documents\\git\\yamu-template\\test\\source\\copysrc\\**')
            expect(path).to.equal('c:\\Users\\Documents\\git\\yamu-template\\test\\source\\copysrc')
        } else {
            let path = getGlobBase('/a/b/c/**')
            expect(path).to.equal('/a/b/c')
        }
    })

    it('makeDirRecursive', async () => {
        let destDir = resolve(__dirname, 'source/a/b/c/d/a.a'),
            destFile = resolve(destDir, 'a.a'),
            rmDir = resolve(__dirname, 'source/a')

        await rmRf(rmDir)
        makeDirRecursive(destFile)
        expect(existsSync(destDir)).to.equal(true)
        await rmRf(rmDir)
    })

    it('del a directory success', async () => {
        let dest = resolve(__dirname, './source/copydest'),
            src = resolve(__dirname, './source/copysrc/**')

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