const path = require('path')

function r200(res, err) {
    res.statusCode = 500
    res.end(`Error getting the file: ${err}`)
}

module.exports = r200