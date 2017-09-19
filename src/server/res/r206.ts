import { Writable, WritableOptions } from 'stream'
import { ServerResponse } from 'http'

import { getContentType, setHeaderContentType, setHeaderContentLength, setHeaderETag } from './header'

class R206 extends Writable {
    constructor(private res: ServerResponse, filePath: string, options?: WritableOptions) {
        super(options)
        Object.assign(this, header)
        this.res.statusCode = 206

        this.setHeaderContentType(filePath)
        this.setHeaderContentLength(filePath)
    }

    _write(chunk: any, encoding: string, callback: Function) {
        this.res.write(chunk, callback)
    }

    _final(callback: Function) {
        this.res.end(null, callback)
    }
}

function res206(res: ServerResponse, filePath: string) {

}

export { res206 }