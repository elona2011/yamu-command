import { resolve } from 'path'
import * as opn from 'opn'
import { spawn } from 'child_process'
import { server } from '../../server/server'
import { pcss } from './pcss'
import { log } from '../../common/output'
import { cmdName } from '../../common/common'

function serverInit(dir: string, program: { port: number, dir: string }) {
    let port = 9000

    if (!dir) {
        dir = resolve(process.cwd(), process.env.npm_package_config_dir || '')
    }

    if (program.port) {
        port = program.port
    }

    if (program.dir) {
        dir = resolve(process.cwd(), program.dir)
    }

    log('watching pcss file at ' + dir)
    // pcss()
    // const pcss = spawn(cmdName('yamu'), ['pcss', '-w', dir])
    // pcss.stdout.on('data', (d: string) => {
    //     //输出无空行
    //     process.stdout.write(`pcss: ${d}`)

    //     //输出有空行
    //     // console.log(`pcss: ${d}`)
    // })

    log('starting server at ' + dir)
    server(dir, port)

    opn('http://localhost:' + port)
}

export { serverInit }