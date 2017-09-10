function r404(res, _a) {
    var path = _a.path;
    res.statusCode = 404;
    res.end("File " + path + " not found!");
}
module.exports = r404;
