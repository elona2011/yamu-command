const url = require('url')
import { exists, statSync } from 'fs'
import { IncomingMessage, ServerResponse } from "http";

const chokidar = require('chokidar');

const { isRangeReq } = require('../req/range')

const r404 = require('../res/r404')
const { res200 } = require('../res/r200')
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

let watcher

function watchFileChange(ws, dir) {
    if (watcher) {
        watcher.close()
    }

    watcher = chokidar.watch(dir, {
        ignored: /\.pcss$/
    })
        .on('change', p => {
            ws.send('reload', () => {
                console.log('detected file "' + p + '" changed, reloaded the page')
            })
        })
}

function getFilePath(dir, reqUrl) {
    const parsedUrl = url.parse(reqUrl)
    let filePath = dir + parsedUrl.pathname

    return filePath
}

module.exports = {
    doFile,
    getFilePath,
    watchFileChange
}