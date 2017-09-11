import * as http from 'http'
import * as WebSocket from 'ws'

const {
    doFile,
    watchFileChange
} = require('./file/file')

function server(dir: Dir, port: Port) {
    http.createServer(function (req, res) {
        console.log(`http: ${req.method} ${req.url}`)

        doFile(req, res, dir)
    }).listen(+port)

    let wss = new WebSocket.Server({
        port: 19009
    })
    wss.on('connection', function connection(ws) {
        console.log('web socket connected')
        watchFileChange(ws, dir)
    });
}

module.exports = server