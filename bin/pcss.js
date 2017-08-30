#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const cssnext = require("postcss-cssnext")
const program = require('commander')

program
    .command('watch <file>')
    .action(file => {
        console.log('watching pcss file...', file)
        file = path.join(process.cwd(), file)
        fs.watch(file, e => parseCss(file))
    })
    .parse(process.argv)

program
    .command('parse <file>')
    .action(file => {
        file = path.join(process.cwd(), file)
        parseCss(file)
    })

program.parse(process.argv)

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