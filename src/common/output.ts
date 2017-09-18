export default class Output {
    constructor(private fileName: string) {
        let arr = this.fileName.split('yamu')
        if (arr.length) {
            this.fileName = arr[arr.length - 1]
        }
    }

    log(str: string) {
        console.log(this.fileName + ':', str)
    }
}
