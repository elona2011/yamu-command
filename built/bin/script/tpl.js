const fs = require('fs');
const path = require('path');
module.exports = function (dir) {
    let target, fileList = ['index.html', 'index.js', 'index.pcss', 'README.md'];
    if (typeof dir === 'undefined') {
        throw new Error('no dir given');
    }
    let sourcePath = path.join(__dirname, '../src/tpl'), targetPath = path.join(process.cwd(), dir);
    fileList.forEach(name => {
        fs.createReadStream(path.join(sourcePath, name))
            .pipe(fs.createWriteStream(path.join(targetPath, name))
            .on('close', () => console.log(`copying ${name} to folder`)));
    });
};
