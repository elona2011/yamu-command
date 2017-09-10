var fs = require('fs');
var path = require('path');
var js;
function inject(data) {
    if (!data)
        return;
    if (!js) {
        js = fs.readFileSync(path.join(__dirname, 'client.js'), 'utf8');
    }
    var script = "<script type=\"application/javascript\">\n        " + js + "\n    </script>";
    var index = data.lastIndexOf('</body>');
    if (index) {
        data = data.slice(0, index) + script + data.slice(index);
    }
    else {
        data += script;
    }
    return data;
}
module.exports = inject;
