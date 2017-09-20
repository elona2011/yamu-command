import { createServer, IncomingMessage, ServerResponse } from 'http'
import * as WebSocket from 'ws'

import { doFile, watchFileChange } from './file/file'
import Output from '../common/output'

let output = new Output(__filename)

function server(dir: Dir, port: Port) {
    createServer(function (req: IncomingMessage, res: ServerResponse): void {
        output.log(`http: ${req.method} ${req.url}`)

        doFile(req, res, dir)
    }).listen(+port)

    let wss = new WebSocket.Server({ port: 19009 })
    wss.on('connection', function connection(ws) {
        output.log('web socket connected')
        watchFileChange(ws, dir)
    });
}

export { server }