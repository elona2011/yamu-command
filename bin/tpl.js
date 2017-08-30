#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

let program = require('commander')

console.log('copying template to folder');

program
    .arguments('<dir>')
    .action(function (dir) {
        let sourcePath = path.join(process.cwd(), 'node_modules/yamu/src'),
            targetPath = path.join(process.cwd(), dir)

        fs.createReadStream(path.join(sourcePath, 'index.html'))
            .pipe(fs.createWriteStream(path.join(targetPath, 'index.html')))
        fs.createReadStream(path.join(sourcePath, 'index.js'))
            .pipe(fs.createWriteStream(path.join(targetPath, 'index.js')))
        fs.createReadStream(path.join(sourcePath, 'index.css'))
            .pipe(fs.createWriteStream(path.join(targetPath, 'index.css')))
    })
    .parse(process.argv)