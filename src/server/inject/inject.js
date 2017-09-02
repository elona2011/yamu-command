const fs = require('fs')
const path = require('path')

let js

function inject(data) {
    if (!data) return

    if (!js) {
        js = fs.readFileSync(path.join(__dirname, 'client.js'), 'utf8')
    }
    let script = `<script type="application/javascript">
        ${js}
    </script>`
    let index = data.lastIndexOf('</body>')
    if (index) {
        data = data.slice(0, index) + script + data.slice(index)
    } else {
        data += script
    }
    return data
}

module.exports = inject