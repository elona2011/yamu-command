var url = require('url');
function r302(res, newUrl) {
    res.writeHead(302, {
        'Location': url.resolve(newUrl, 'index.html')
    });
    res.end();
}
module.exports = r302;
