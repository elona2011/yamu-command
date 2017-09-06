const { readFileSync, writeFileSync, readFile, writeFile, accessSync, lstatSync, readdirSync, mkdirSync, createReadStream, createWriteStream } = require('fs')
const { join } = require('path')
const { Converter } = require('showdown')

const isDir = dir => lstatSync(dir).isDirectory()

function loopDir(dirF, dirT) {
    if (!isDir(dirF)) throw new Error('dir is not a directory')

    console.log('dirT', dirT)

    if (!isDir(dirT)) {
        console.log('dirT', dirT)
        mkdirSync(dirT)
    }

    if (isProject(dirF)) {
        copyR(dirF, dirT)
        writeReadmeToHtml(dirT)
    } else {
        readdirSync(dirF)
            .filter(d => isDir(join(dirF, d)))
            .forEach(d => loopDir(join(dirF, d), join(dirT, d)))
    }
}

function copyR(dirF, dirT) {
    if (!isDir(dirF)) throw new Error('dir is not a directory')

    readdirSync(dirF).forEach(d => {
        if (isDir(join(dirF, d))) {
            mkdirSync(join(dirT, d))
            copyR(join(dirF, d), join(dirT, d))
        } else {
            console.log('writeFileSync', join(dirT, d), join(dirF, d))
            writeFileSync(join(dirT, d), readFileSync(join(dirF, d)))
        }
    })
}

function writeReadmeToHtml(dir) {
    let converter = new Converter()
    let content = readFileSync(join(dir, 'README.md'), 'utf8')
    content = converter.makeHtml(content)

    let indexPath = join(dir, 'index.html')
    readFile(indexPath, 'utf8', (err, d) => {
        let index = d.indexOf('<script ')
        let all = d.slice(0, index) + content + d.slice(index)
        writeFile(indexPath, all, 'utf8', err => console.log(err))
    })
}

function isProject(dir) {
    if (!isDir(dir)) return false

    try {
        accessSync(join(dir, 'README.md'))
        accessSync(join(dir, 'index.html'))
    } catch (e) {
        console.log('accessSync', dir, e)
        return false
    }
    return true
}

module.exports = { loopDir }