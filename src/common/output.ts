import { basename } from 'path'

function log(str: string): void {
    console.log(getCallerFileName() + ':', str)
}

function getCallerFileName(): string | void {
    let stack = new Error().stack,
        stackArr,
        fileNameArr: string[] = []

    if (stack) {
        stackArr = stack.split('\n')
        for (let i = 0; i < stackArr.length; i++) {
            let r = /\(([^:]*):/.exec(stackArr[i])
            if (r && r.length > 1) {
                fileNameArr.push(basename(r[1]))
                if (fileNameArr.length > 1) {
                    return fileNameArr[1]
                }
            }
        }
    }
}

export { log, getCallerFileName }
