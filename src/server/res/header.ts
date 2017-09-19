import { parse } from 'path'
import { statSync } from 'fs'
import { ServerResponse } from 'http'

import { getType } from 'mime'

function getContentType(filePath: string) {
    let ext = parse(filePath).ext
    return getType(ext)
}

function setHeaderContentType(res: ServerResponse, filePath: string) {
    let contentType = getContentType(filePath)
    if (contentType) {
        res.setHeader('Content-Type', contentType)
    }
}

function setHeaderContentLength(res: ServerResponse, filePath: string) {
    let size = statSync(filePath).size
    res.setHeader('Content-Length', size)
}

function setHeaderETag(res: ServerResponse) {
    res.setHeader('ETag', "hwGsXizcT76zd05rupUiKxVtUsI=")
}

export { getContentType, setHeaderContentType, setHeaderContentLength, setHeaderETag }