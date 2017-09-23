import { parse } from 'url'
import { exists, statSync } from 'fs'
import { IncomingMessage, ServerResponse } from "http";

import { FSWatcher, watch } from 'chokidar'
import * as WebSocket from "ws";

const { isRangeReq } = require('../req/range')

import { r404 } from '../res/r404'
import { res200 } from '../res/r200'
import { r500 } from '../res/r500'
import { r302 } from '../res/r302'
import { inject } from '../inject/inject'
import Output from '../../common/output'

const output = new Output(__filename)

function doFile(req: IncomingMessage, res: ServerResponse, dir: Dir) {
    let filePath = getFilePath(dir, req.url)

    exists(filePath, function (exists) {
        if (!exists) {
            r404(res, {
                filePath
            })
            return
        }

        if (statSync(filePath).isDirectory()) {
            if (req.url) {
                let dirUrl = req.url.substr(-1) === '/' ? req.url : req.url + '/'
                r302(res, dirUrl)
                return
            }
        }

        isRangeReq(req)
        res200(res, filePath)
    })
}

let watcher: FSWatcher

function watchFileChange(ws: WebSocket, dir: Dir) {
    if (watcher) {
        watcher.close()
    }

    watcher = watch(dir, {
        ignored: /\.pcss$/
    })
        .on('change', p => {
            ws.send('reload', () => {
                output.log('detected file "' + p + '" changed, reloaded the page')
            })
        })
}

function getFilePath(dir: Dir, reqUrl = '') {
    const parsedUrl = parse(reqUrl)
    let filePath = dir + parsedUrl.pathname

    return filePath
}

export { doFile, getFilePath, watchFileChange }