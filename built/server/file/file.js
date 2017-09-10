var url = require('url');
var fs = require('fs');
var path = require('path');
var chokidar = require('chokidar');
var isRangeReq = require('../req/range').isRangeReq;
var r404 = require('../res/r404');
var res200 = require('../res/r200').res200;
var r500 = require('../res/r500');
var r302 = require('../res/r302');
var inject = require('../inject/inject');
function doFile(req, res, dir) {
    var filePath = getFilePath(dir, req.url);
    fs.exists(filePath, function (exists) {
        if (!exists) {
            r404(res, {
                filePath: filePath
            });
            return;
        }
        if (fs.statSync(filePath).isDirectory()) {
            var dirUrl = req.url.substr(-1) === '/' ? req.url : req.url + '/';
            r302(res, dirUrl);
            return;
        }
        isRangeReq(req);
        res200(res, filePath);
    });
}
var watcher;
function watchFileChange(ws, dir) {
    if (watcher) {
        watcher.close();
    }
    watcher = chokidar.watch(dir, {
        ignored: /\.pcss$/
    })
        .on('change', function (p) {
        ws.send('reload', function () {
            console.log('detected file "' + p + '" changed, reloaded the page');
        });
    });
}
function getFilePath(dir, reqUrl) {
    var parsedUrl = url.parse(reqUrl);
    var filePath = dir + parsedUrl.pathname;
    return filePath;
}
module.exports = {
    doFile: doFile,
    getFilePath: getFilePath,
    watchFileChange: watchFileChange
};
