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

    pcss({ watch: dir })
    server(dir, port)

    opn('http://localhost:' + port)
}

export { serverInit }