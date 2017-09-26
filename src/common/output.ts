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
            let path = getPathFromStack(n)
            path && fileNameArr.push(basename(path))
            if (fileNameArr.length > 1) {
                if (fileNameArr[fileNameArr.length - 1] !== fileNameArr[0])
                    return fileNameArr[fileNameArr.length - 1]
            }
        }
    }
}

function getPathFromStack(path: string): string {
    let r = /\((.*):\d+:\d/.exec(path)
    if (r && r.length > 1) {
        return r[1]
    } else {
        return ''
    }
}

export { log, getCallerFileName, getPathFromStack }
