const { Writable } = require('stream')
const { createReadStream, readFileSync } = require('fs')

const inject = require('../inject/inject')
const { getContentType, setHeaderContentType, setHeaderContentLength, setHeaderETag } = require('./header')

class R200 extends Writable {
    constructor(res, filePath, options) {
        super(options)
        this.res = res
        setHeaderContentType(res, filePath)
        setHeaderETag(res)
    }

    _write(chunk, encoding, callback) {
        this.res.write(chunk, callback)
    }

    _final(callback) {
        this.res.end(null, callback)
    }
}

function res200(res, filePath) {
    let r200 = new R200(res, filePath)

    if (getContentType(filePath) === 'text/html') {
        let data = readFileSync(filePath, 'utf8')
        data = inject(data)
        res.setHeader('Content-Length', data.length)
        r200.end(data)
    } else {
        setHeaderContentLength(res, filePath)
        createReadStream(filePath)
            .on('error', err => {
                r500(res, err)
            })
            .pipe(r200)
    }
}

module.exports = { res200 }