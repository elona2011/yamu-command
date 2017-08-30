#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const cssnext = require("postcss-cssnext")
const program = require('commander')

program
    .option('-w, --watch <file>')
    .option('-f, --file <file>')
    .parse(process.argv)

if (program.watch) {
    let file = program.watch
    console.log('111', file)
    
    console.log('watching pcss file...', file)
    file = path.join(process.cwd(), file)
    fs.watch(file, e => parseCss(file))
}

if (program.file) {
    let file = program.parse
    console.log('222', file)
    console.log('333', process.cwd())
    
    file = path.join(process.cwd(), file)
    parseCss(file)
}

function parseCss(dir) {
    let fileName = path.basename(dir, '.pcss'),
        filePath = path.dirname(dir)

    console.log('parsing pcss file...')
    fs.readFile(dir, (err, css) => {
        postcss([cssnext])
            .process(css, {
                from: dir,
                to: path.join(filePath, fileName + '.css')
            })
            .then(result => {
                fs.writeFile(path.join(filePath, fileName + '.css'), result.css);
                if (result.map) fs.writeFile(path.join(filePath, fileName + '.css.map'), result.map);
                console.log('parsing pcss file success!')
            });
    });
}