import { parse } from 'path'
import { statSync } from 'fs'

import { lookup } from 'mime'

function getContentType(filePath) {
    let ext = parse(filePath).ext
    return lookup(ext)
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

export { getContentType, setHeaderContentType, setHeaderContentLength, setHeaderETag }