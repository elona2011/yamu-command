import { basename } from 'path'

function log(...str: any[]): void {
    console.log(getCallerFileName() + ':', ...str)
}

function getCallerFileName(): string | void {
    let stack = new Error().stack,
        stackArr,
        fileNameArr: string[] = []

    if (stack) {
        stackArr = stack.split('\n')
        for (let n of stackArr) {
            let r = /\(([^:]*):/.exec(n)
            if (r && r.length > 1) {
                fileNameArr.push(basename(r[1]))
                if (fileNameArr.length > 1) {
                    if (fileNameArr[fileNameArr.length - 1] !== fileNameArr[0])
                        return fileNameArr[fileNameArr.length - 1]
                }
            }
        }
    }
}

export { log, getCallerFileName }
