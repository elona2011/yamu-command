var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Writable = require('stream').Writable;
var _a = require('fs'), createReadStream = _a.createReadStream, readFileSync = _a.readFileSync;
var inject = require('../inject/inject');
var _b = require('./header'), getContentType = _b.getContentType, setHeaderContentType = _b.setHeaderContentType, setHeaderContentLength = _b.setHeaderContentLength, setHeaderETag = _b.setHeaderETag;
var R200 = /** @class */ (function (_super) {
    __extends(R200, _super);
    function R200(res, filePath, options) {
        var _this = _super.call(this, options) || this;
        _this.res = res;
        setHeaderContentType(res, filePath);
        setHeaderETag(res);
        return _this;
    }
    R200.prototype._write = function (chunk, encoding, callback) {
        this.res.write(chunk, callback);
    };
    R200.prototype._final = function (callback) {
        this.res.end(null, callback);
    };
    return R200;
}(Writable));
function res200(res, filePath) {
    var r200 = new R200(res, filePath);
    if (getContentType(filePath) === 'text/html') {
        var data = readFileSync(filePath, 'utf8');
        data = inject(data);
        res.setHeader('Content-Length', data.length);
        r200.end(data);
    }
    else {
        setHeaderContentLength(res, filePath);
        createReadStream(filePath)
            .on('error', function (err) {
            r500(res, err);
        })
            .pipe(r200);
    }
}
module.exports = { res200: res200 };
