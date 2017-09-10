var http = require('http');
var WebSocket = require('ws');
var _a = require('./file/file'), doFile = _a.doFile, watchFileChange = _a.watchFileChange;
function server(dir, port) {
    http.createServer(function (req, res) {
        console.log("http: " + req.method + " " + req.url);
        doFile(req, res, dir);
    }).listen(+port);
    var wss = new WebSocket.Server({
        port: 19009
    });
    wss.on('connection', function connection(ws) {
        console.log('web socket connected');
        watchFileChange(ws, dir);
    });
}
module.exports = server;
