import { readFile, writeFileSync } from 'fs'
import { join, resolve, basename, dirname } from 'path'
import * as postcss from 'postcss'
import * as chokidar from 'chokidar'

const cssnext = require("postcss-cssnext")

function pcss(d: Dir, options: { watch: string, file: string }) {
    if (options.watch) {
        let dir = options.watch

        console.log('watching pcss file...', dir)

        dir = resolve(process.cwd(), dir, '**/*.pcss')
        console.log('dir', dir)
        chokidar.watch(dir)
            .on('change', (p: Dir) => {
                console.log('p', p)
                parseCss(p)
            })
    }

    if (options.file) {
        let file = options.file

        file = join(process.cwd(), file)
        parseCss(file)
    }

    function parseCss(dir: Dir) {
        let fileName = basename(dir, '.pcss'),
            filePath = dirname(dir)

        console.log('parsing pcss file "' + dir + '" ...')
        readFile(dir, (err, css) => {
            postcss([cssnext])
                .process(css, {
                    from: dir,
                    to: join(filePath, fileName + '.css')
                })
                .then((result: any) => {
                    writeFileSync(join(filePath, fileName + '.css'), result.css);
                    if (result.map)
                        writeFileSync(join(filePath, fileName + '.css.map'), result.map);
                    console.log('parsing pcss file success!')
                });
        });
    }
}

export { pcss }