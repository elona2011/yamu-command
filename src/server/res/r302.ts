import { resolve } from 'url'
import { ServerResponse } from 'http'

function r302(res: ServerResponse, newUrl: string) {
    res.writeHead(302, {
        'Location': resolve(newUrl, 'index.html')
    })
    res.end()
}

export { r302 }