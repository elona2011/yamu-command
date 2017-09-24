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
import { log } from '../../common/output'

function doFile(req: IncomingMessage, res: ServerResponse, dir: string) {
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

function watchFileChange(ws: WebSocket, dir: string) {
    if (watcher) {
        watcher.close()
    }

    watcher = watch(dir, {
        ignored: /\.pcss$/
    })
        .on('change', p => {
            ws.send('reload', () => {
                log('detected file "' + p + '" changed, reloaded the page')
            })
        })
}

function getFilePath(dir: string, reqUrl = '') {
    const parsedUrl = parse(reqUrl)
    let filePath = dir + parsedUrl.pathname

    return filePath
}

export { doFile, getFilePath, watchFileChange }