import { createReadStream, createWriteStream } from 'fs'
import { join } from 'path'

function tpl(dir: string) {
    let target,
        fileList = ['index.html', 'index.js', 'index.pcss', 'README.md']

    if (typeof dir === 'undefined') {
        throw new Error('no dir given')
    }
    let sourcePath = join(__dirname, '../src/tpl'),
        targetPath = join(process.cwd(), dir)

    fileList.forEach(name => {
        createReadStream(join(sourcePath, name))
            .pipe(createWriteStream(join(targetPath, name))
                .on('close', () => console.log(`copying ${name} to folder`)))
    })
}

export { tpl }
