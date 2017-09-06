const { readFileSync, writeFileSync, readFile, writeFile, accessSync, lstatSync, readdirSync, mkdirSync, createReadStream, createWriteStream } = require('fs')
const { join } = require('path')
const { Converter } = require('showdown')

const isDir = dir => {
    let s
    try {
        s = lstatSync(dir)
    }
    catch (e) {
        return false
    }
    return s.isDirectory()
}

function loopDir(dirF, dirT) {
    if (!isDir(dirF)) throw new Error('dir is not a directory')

    if (!isDir(dirT)) {
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
        let source = join(dirF, d),
            target = join(dirT, d)
        if (isDir(source)) {
            if (!isDir(target))
                mkdirSync(target)
            copyR(source, target)
        } else {
            // console.log('writeFileSync', target, source)
            writeFileSync(target, readFileSync(source))
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
        writeFile(indexPath, all, 'utf8', err => {
            if (err) throw err
        })
    })
}

function isProject(dir) {
    if (!isDir(dir)) return false

    try {
        accessSync(join(dir, 'README.md'))
        accessSync(join(dir, 'index.html'))
    } catch (e) {
        // console.log('accessSync', dir, e)
        return false
    }
    return true
}

module.exports = { loopDir }