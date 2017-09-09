const { parse } = require('path')
const { statSync } = require('fs')

const mime = require('mime')

function getContentType(filePath) {
    let ext = parse(filePath).ext
    return mime.lookup(ext)
}

function setHeaderContentType(res, filePath) {
    res.setHeader('Content-Type', getContentType(filePath))
}

function setHeaderContentLength(res, filePath) {
    let size = statSync(filePath).size
    res.setHeader('Content-Length', size)
}

function setHeaderETag(res) {
    res.setHeader('ETag', "hwGsXizcT76zd05rupUiKxVtUsI=")
}

module.exports = { getContentType, setHeaderContentType, setHeaderContentLength, setHeaderETag }