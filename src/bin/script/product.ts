const { resolve } = require('path')
const { loopDir } = require('../../product/product')

module.exports = function product(dir: Dir) {
    let dirFrom = resolve(process.cwd(), process.env.npm_package_config_product_from || 'browser')

    if (dir) {
        dirFrom = resolve(process.cwd(), dir)
    }

    console.log('starting compile product folder "' + dirFrom + '" ...')
    loopDir(dirFrom, resolve(process.cwd(), 'www'))
}
