#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const cssnext = require("postcss-cssnext")
const program = require('commander')
const chokidar = require('chokidar');

program
    .option('-w, --watch <dir>')
    .option('-f, --file <file>')
    .parse(process.argv)

if (program.watch) {
    let dir = program.watch

    console.log('watching pcss file...', dir)

    dir = path.resolve(process.cwd(), dir, '**/*.pcss')
    console.log('dir', dir)
    chokidar.watch(dir)
        .on('change', p => {
            console.log('p', p)
            parseCss(p)
        })
}

if (program.file) {
    let file = program.parse

    file = path.join(process.cwd(), file)
    parseCss(file)
}

function parseCss(dir) {
    let fileName = path.basename(dir, '.pcss'),
        filePath = path.dirname(dir)

    console.log('parsing pcss file "' + dir + '" ...')
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