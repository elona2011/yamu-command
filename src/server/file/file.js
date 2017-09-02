const url = require('url')
const fs = require('fs')
const path = require('path')

const chokidar = require('chokidar');

const r404 = require('../res/r404')
const r200 = require('../res/r200')
const r500 = require('../res/r500')
const r302 = require('../res/r302')
const inject = require('../inject/inject')

function doFile(req, res, dir) {
    let filePath = getFilePath(dir, req.url)

    fs.exists(filePath, function (exists) {
        if (!exists) {
            r404(res, {
                filePath
            })
            return
        }

        if (fs.statSync(filePath).isDirectory()) {
            let dirUrl = req.url.substr(-1) === '/' ? req.url : req.url + '/'
            r302(res, dirUrl)
            return
        }

        fs.readFile(filePath, function (err, data) {
            if (err) {
                r500(res, {
                    err
                })
            } else {
                if (path.extname(filePath) === '.html')
                    data = inject(data)
                r200(res, {
                    data,
                    filePath
                })
            }
        })
    })
}

let watcher

function watchFileChange(ws, dir) {
    if(watcher){
        watcher.close()
    }
    
    watcher = chokidar.watch(dir, {
            ignored: /\.pcss$/
        })
        .on('change', p => {
            console.log('detect file "', p, '" changed')
            ws.send('reload', err => {
                console.log(err)
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