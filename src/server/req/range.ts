import { IncomingMessage } from 'http'

function isRangeReq(req: IncomingMessage) {
    console.log(req.headers.Range)
}

export { isRangeReq }