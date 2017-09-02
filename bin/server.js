#!/usr/bin/env node

const path = require('path')
const os = require('os')
const opn = require('opn')
const program = require('commander')
const spawn = require('child_process').spawn;
const server = require('../src/server/server')

let port = 9000,
    dir = path.resolve(process.cwd(), process.env.npm_package_config_dir || '')

program
    .option('-d, --dir <dir>')
    .option('-p, --port <port>')
    .parse(process.argv)

if (program.port) {
    port = program.port
}

if (program.dir) {
    dir = path.resolve(process.cwd(), program.dir)
}

console.log('watching css file at', dir, '...')
if (os.platform() === 'win32') {
    var cmd = 'npm.cmd'
} else {
    var cmd = 'npm'
}
const pcss = spawn(cmd, ['run', 'pcss', '--', '-w', dir])
pcss.stdout.on('data', d => {
    //输出无空行
    process.stdout.write(`pcss: ${d}`)

    //输出有空行
    // console.log(`pcss: ${d}`)
})

console.log('starting server at', dir, '...')
server(dir, port)

opn('http://localhost:' + port)