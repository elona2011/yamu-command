import { createServer, IncomingMessage, ServerResponse } from 'http'
import * as WebSocket from 'ws'

import { doFile, watchFileChange } from './file/file'
import { log } from '../common/output'

function server(dir: string, port: number) {
    createServer(function (req: IncomingMessage, res: ServerResponse): void {
        log(`http: ${req.method} ${req.url}`)

        doFile(req, res, dir)
    }).listen(+port)

    let wss = new WebSocket.Server({ port: 19009 })
    wss.on('connection', function connection(ws) {
        log('web socket connected')
        watchFileChange(ws, dir)
    });
}

export { server }