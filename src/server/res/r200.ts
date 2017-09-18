import { Writable } from 'stream'
import { createReadStream, readFileSync } from 'fs'
import { IncomingMessage, ServerResponse } from "http";
import { WritableOptions } from 'stream'

import { inject } from '../inject/inject'
import { getContentType, setHeaderContentType, setHeaderContentLength, setHeaderETag } from './header'
import { r500 } from './r500'

class R200 extends Writable {
    constructor(private res: ServerResponse, filePath: string, options?: WritableOptions) {
        super(options)
        setHeaderContentType(res, filePath)
        setHeaderETag(res)
    }

    _write(chunk: any, encoding: string, callback: Function) {
        this.res.write(chunk, callback)
    }

    _final(callback: Function) {
        this.res.end(null, callback)
    }
}

function res200(res: ServerResponse, filePath: string) {
    let r200 = new R200(res, filePath)

    if (getContentType(filePath) === 'text/html') {
        let data = readFileSync(filePath, 'utf8')
        data = inject(data)
        res.setHeader('Content-Length', data.length)
        r200.end(data)
    } else {
        setHeaderContentLength(res, filePath)
        createReadStream(filePath)
            .on('error', (err: Error) => {
                r500(res, err)
            })
            .pipe(r200)
    }
}

export { res200 }