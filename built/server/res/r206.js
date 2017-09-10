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
var _a = require('./header'), getContentType = _a.getContentType, setHeaderContentType = _a.setHeaderContentType, setHeaderContentLength = _a.setHeaderContentLength, setHeaderETag = _a.setHeaderETag;
var R206 = /** @class */ (function (_super) {
    __extends(R206, _super);
    function R206(res, filePath, options) {
        var _this = _super.call(this, options) || this;
        Object.assign(_this, header);
        _this.res = res;
        _this.res.statusCode = 206;
        _this.setHeaderContentType(filePath);
        _this.setHeaderContentLength(filePath);
        return _this;
    }
    R206.prototype._write = function (chunk, encoding, callback) {
        this.res.write(chunk, callback);
    };
    R206.prototype._final = function (callback) {
        this.res.end(null, callback);
    };
    return R206;
}(Writable));
function res206(res, filePath) {
}
module.exports = { res206: res206 };
