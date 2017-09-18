function cmdName(name: string) {
    if (process.platform === 'win32') {
        return name + '.cmd'
    }
    return name
}

export { cmdName }