import { ServerResponse } from 'http'

function r500(res: ServerResponse, err: Error) {
    res.statusCode = 500
    res.end(`Error getting the file: ${err}`)
}

export { r500 }