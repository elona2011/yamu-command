import { readFileSync } from 'fs'
import { join } from 'path'

let js: string

function inject(data: string): string {
    if (!data) return ''

    if (!js) {
        js = readFileSync(join(__dirname, 'client.js'), 'utf8')
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

export { inject }