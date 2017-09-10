const { readFileSync, writeFileSync, readFile, writeFile, accessSync, lstatSync, readdirSync, mkdirSync, createReadStream, createWriteStream } = require('fs')
const { join, dirname } = require('path')
const { Converter } = require('showdown')

const getDirStat = dir => {
    let s
    try {
        s = lstatSync(dir)
    }
    catch (e) {
        return null
    }
    if (s.isDirectory()) return 'dir'
    if (s.isFile()) return 'file'
}

function loopDir(dirF, dirT) {
    if (getDirStat(dirF) !== 'dir') throw new Error('dir is not a directory')

    if (isProject(dirF)) {
        copyR(dirF, dirT)
        writeReadmeToHtml(dirT)
    } else {
        readdirSync(dirF)
            .filter(d => getDirStat(join(dirF, d)) === 'dir')
            .forEach(d => loopDir(join(dirF, d), join(dirT, d)))
    }
}

function copyR(dirF, dirT) {
    if (getDirStat(dirF) !== 'dir') throw new Error('source dir is not a directory')

    mkDirLoop(dirT)

    readdirSync(dirF).forEach(d => {
        let source = join(dirF, d),
            target = join(dirT, d)
        if (getDirStat(source) === 'dir') {
            mkDirLoop(target)
            copyR(source, target)
        } else {
            writeFileSync(target, readFileSync(source))
        }
    })
}

function mkDirLoop(dir) {
    if (getDirStat(dir) === null) {
        mkDirLoop(dirname(dir))
        mkdirSync(dir)
    }
}

function writeReadmeToHtml(dir) {
    let converter = new Converter()
    let content = readFileSync(join(dir, 'README.md'), 'utf8')
    content = converter.makeHtml(content)

    let indexPath = join(dir, 'index.html')
    readFile(indexPath, 'utf8', (err, d) => {
        let index = d.indexOf('<script ')
        let all = d.slice(0, index) + content + d.slice(index)
        writeFile(indexPath, all, 'utf8', err => {
            if (err) throw err
        })
    })
}

function isProject(dir) {
    if (getDirStat(dir) !== 'dir') return false

    try {
        accessSync(join(dir, 'README.md'))
        accessSync(join(dir, 'index.html'))
    } catch (e) {
        return false
    }
    return true
}

module.exports = { loopDir }