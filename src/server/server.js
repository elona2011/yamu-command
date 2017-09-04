const http = require('http')
const WebSocket = require('ws')

const {
    doFile,
    watchFileChange
} = require('./file/file')

function server(dir, port) {
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