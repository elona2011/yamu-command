import { parse } from 'url'
import { exists, statSync } from 'fs'
import { IncomingMessage, ServerResponse } from "http";

import { FSWatcher, watch } from 'chokidar'
import * as WebSocket from "ws";

const { isRangeReq } = require('../req/range')

import { r404 } from '../res/r404'
import { res200 } from '../res/r200'
const r500 = require('../res/r500')
const r302 = require('../res/r302')
const inject = require('../inject/inject')

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
                console.log('detected file "' + p + '" changed, reloaded the page')
            })
        })
}

function getFilePath(dir: Dir, reqUrl = '') {
    const parsedUrl = parse(reqUrl)
    let filePath = dir + parsedUrl.pathname

    return filePath
}

export { doFile, getFilePath, watchFileChange }