function r404(res, { path }) {
    res.statusCode = 404;
    res.end(`File ${path} not found!`);
}
module.exports = r404;
