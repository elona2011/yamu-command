import { spawn } from 'child_process'
import { resolve } from 'path'

import { copy, rm } from './shell'
import Output from '../../output/output'

let output = new Output(__filename)

module.exports = function product(dir: Dir) {
    let dirFrom = resolve(process.cwd(), process.env.npm_package_config_product_from || 'src')
    let dirTo = resolve(process.cwd(), process.env.npm_package_config_product_to || 'built')

    if (dir) {
        dirTo = resolve(process.cwd(), dir)
    }

    output.log('delete built folder: ' + dirTo)
    rm(dirTo)
    copy('src/**/*.html', 'src/**/*.pcss', 'src/**/*.md', 'built/')

    //run tsc commandline
    let child = spawn('tsc.cmd')
    child.on('error',err=>{
        output.log(err+'')
    })
    child.stdout.pipe(process.stdout)
}
