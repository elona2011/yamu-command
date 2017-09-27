import { resolve, join, isAbsolute } from 'path'
import { writeFile } from 'fs'

function cmdName(name: string) {
    if (process.platform === 'win32') {
        return name + '.cmd'
    }
    return name
}

async function editJsonFile(filePath: string, key: string[], value: any): Promise<any> {
    return new Promise((res, rej) => {
        if (!isAbsolute(filePath)) {
            throw new Error('filePath is not absolute path!')
        }
        let tsconfig = require(filePath),
            tmp = tsconfig

        for (let n of key) {
            if (key.lastIndexOf(n) === key.length - 1) {
                tmp[n] = value
            }
            tmp = tmp[n]
        }
        
        writeFile(filePath, JSON.stringify(tsconfig, null, 4), err => {
            res()
        })
    })
}

export { cmdName, editJsonFile }