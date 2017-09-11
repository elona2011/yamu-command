#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

let program = require('commander')

let target,
    fileList = ['index.html', 'index.js', 'index.pcss', 'README.md']

program
    .arguments('<dir>')
    .action(function(dir) {
        console.log('dir', dir)
        target = dir
    })
    .parse(process.argv)

if (typeof target === 'undefined') {
    throw new Error('no dir given')
}
let sourcePath = path.join(__dirname, '../src/tpl'),
    targetPath = path.join(process.cwd(), target)

fileList.forEach(name => {
    fs.createReadStream(path.join(sourcePath, name))
        .pipe(fs.createWriteStream(path.join(targetPath, name))
            .on('close', e => console.log(`copying ${name} to folder`)))
})