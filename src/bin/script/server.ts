import * as path from 'path'
import * as opn from 'opn'
import { spawn } from 'child_process'
import { server } from '../../server/server'
import Output from '../../common/output'

let output = new Output(__filename)

function beforeServer(dir: Dir, program: { port: number, dir: string }) {
    let port = 9000

    if (!dir) {
        dir = path.resolve(process.cwd(), process.env.npm_package_config_dir || '')
    }

    if (program.port) {
        port = program.port
    }

    if (program.dir) {
        dir = path.resolve(process.cwd(), program.dir)
    }

    output.log('watching css file at ' + dir)
    if (process.platform === 'win32') {
        var cmd = 'npm.cmd'
    } else {
        var cmd = 'npm'
    }
    const pcss = spawn(cmd, ['run', 'pcss', '--', '-w', dir])
    pcss.stdout.on('data', (d: string) => {
        //输出无空行
        process.stdout.write(`pcss: ${d}`)

        //输出有空行
        // console.log(`pcss: ${d}`)
    })

    output.log('starting server at ' + dir)
    server(dir, port)

    opn('http://localhost:' + port)
}

export { beforeServer }