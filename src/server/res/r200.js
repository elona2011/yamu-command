const { parse } = require('path')
const { statSync } = require('fs')
const { lookup } = require('mime')
const { Writable } = require('stream')
const { StringDecoder } = require('string_decoder');

const inject = require('../inject/inject')

class R200 extends Writable {
    constructor(res, filePath, options) {
        super(options)
        this.res = res
        this.ext = parse(filePath).ext
        this.res.setHeader('content-type', lookup(this.ext) || 'text/plain')
        this.size = statSync(filePath).size
        this.res.setHeader('content-length', this.size)
        this.decoder = new StringDecoder('utf8')
        this.data = ''
    }

    _write(chunk, encoding, callback) {
        if (this.res.getHeader('content-type') === 'text/html') {
            this.data += this.decoder.write(chunk)
            // console.log('chunk', chunk)
            callback()
        } else {
            this.res.write(chunk, callback)
            // console.log('chunk', chunk)
        }
    }

    _final(callback) {
        if (this.res.getHeader('content-type') === 'text/html') {
            this.data += this.decoder.end()
            if (this.data.indexOf('</body>') !== -1) {
                this.data = inject(this.data)
            }
            this.res.end(this.data, callback)
        } else {
            this.res.end(null, callback)
        }
    }
}

module.exports = R200