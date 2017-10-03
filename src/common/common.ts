import { resolve, join, relative, isAbsolute, parse, format } from 'path'
import { writeFile } from 'fs'

let dirFromDef = 'src',
    dirToDef = 'built'

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
        let tsconfig: JSON,
            data: { [index: string]: any }

        try {
            tsconfig = require(filePath)
            data = tsconfig
        } catch (error) {
            throw error
        }

        for (let n of key) {
            if (key.lastIndexOf(n) === key.length - 1) {
                data[n] = value
            }
            data = data[n]
        }

        writeFile(filePath, JSON.stringify(tsconfig, null, 4), err => {
            res()
        })
    })
}

function getFileTo(fileFrom: string, dirFrom: string, dirTo: string, ext?: string): string {
    if (!fileFrom.match(dirFrom)) {
        throw new Error('file is not in the directory')
    }
    let result = resolve(dirTo, relative(dirFrom, fileFrom))
    if (ext) {
        let obj = parse(result)
        obj.ext = ext
        delete obj.base
        result = format(obj)
    }
    return result
}

function getDirFrom(dirFrom?: string): string {
    return resolve(dirFrom || process.env.npm_package_config_product_from || dirFromDef)
}

function getDirTo(dirTo?: string): string {
    return resolve(dirTo || process.env.npm_package_config_product_to || dirToDef)
}

export { cmdName, editJsonFile, getDirFrom, getDirTo, getFileTo }