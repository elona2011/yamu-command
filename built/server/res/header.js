var parse = require('path').parse;
var statSync = require('fs').statSync;
var mime = require('mime');
function getContentType(filePath) {
    var ext = parse(filePath).ext;
    return mime.lookup(ext);
}
function setHeaderContentType(res, filePath) {
    res.setHeader('Content-Type', getContentType(filePath));
}
function setHeaderContentLength(res, filePath) {
    var size = statSync(filePath).size;
    res.setHeader('Content-Length', size);
}
function setHeaderETag(res) {
    res.setHeader('ETag', "hwGsXizcT76zd05rupUiKxVtUsI=");
}
module.exports = { getContentType: getContentType, setHeaderContentType: setHeaderContentType, setHeaderContentLength: setHeaderContentLength, setHeaderETag: setHeaderETag };
