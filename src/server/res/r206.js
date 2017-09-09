const { Writable } = require('stream')

const { getContentType, setHeaderContentType, setHeaderContentLength, setHeaderETag } = require('./header')

class R206 extends Writable {
    constructor(res, filePath, options) {
        super(options)
        Object.assign(this, header)
        this.res = res
        this.res.statusCode = 206

        this.setHeaderContentType(filePath)
        this.setHeaderContentLength(filePath)
    }

    _write(chunk, encoding, callback) {
        this.res.write(chunk, callback)
    }

    _final(callback) {
        this.res.end(null, callback)
    }
}

function res206(res, filePath) {

}

module.exports = { res206 }