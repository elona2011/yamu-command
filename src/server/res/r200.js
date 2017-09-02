const path = require('path')

const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
};

function r200(res, {
    data,
    filePath
}) {
    const ext = path.parse(filePath).ext
    res.setHeader('Content-type', mimeType[ext] || 'text/plain')
    res.end(data)
}

module.exports = r200