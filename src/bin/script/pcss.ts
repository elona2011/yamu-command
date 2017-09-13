const fs = require('fs');
import * as path from 'path'
const postcss = require('postcss');
const cssnext = require("postcss-cssnext")
const chokidar = require('chokidar');

module.exports = function pcss(d: Dir, options: { watch: string, file: string }) {
    if (options.watch) {
        let dir = options.watch

        console.log('watching pcss file...', dir)

        dir = path.resolve(process.cwd(), dir, '**/*.pcss')
        console.log('dir', dir)
        chokidar.watch(dir)
            .on('change', (p: Dir) => {
                console.log('p', p)
                parseCss(p)
            })
    }

    if (options.file) {
        let file = options.file

        file = path.join(process.cwd(), file)
        parseCss(file)
    }

    function parseCss(dir: Dir) {
        let fileName = path.basename(dir, '.pcss'),
            filePath = path.dirname(dir)

        console.log('parsing pcss file "' + dir + '" ...')
        fs.readFile(dir, (err: Error, css: string) => {
            postcss([cssnext])
                .process(css, {
                    from: dir,
                    to: path.join(filePath, fileName + '.css')
                })
                .then((result: any) => {
                    fs.writeFile(path.join(filePath, fileName + '.css'), result.css);
                    if (result.map) fs.writeFile(path.join(filePath, fileName + '.css.map'), result.map);
                    console.log('parsing pcss file success!')
                });
        });
    }
}