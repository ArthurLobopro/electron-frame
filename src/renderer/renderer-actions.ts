const { ipcRenderer } = require('electron')

const isDisabled = (event: { currentTarget: { classList: { contains: (arg0: string) => any } } }) => {
    return event.currentTarget.classList.contains('disable')
}

const minimize = (event: any) => {
    if (!isDisabled(event)) {
        ipcRenderer.send('minimize')
    }
}

const expand = (event: any) => {
    if (!isDisabled(event)) {
        ipcRenderer.send('expand')
    }
}

const close = (event: any) => {
    if (!isDisabled(event)) {
        ipcRenderer.send('close')
    }
}

export { minimize, expand, close }