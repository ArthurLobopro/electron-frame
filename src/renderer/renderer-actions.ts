const { ipcRenderer } = require('electron')

const isDisabled = event => {
    return event.currentTarget.classList.contains('disable')
}

const minimize = (event) => {
    if (!isDisabled(event)) {
        ipcRenderer.send('minimize')
    }
}

const expand = event => {
    if (!isDisabled(event)) {
        ipcRenderer.send('expand')
    }
}

const close = event => {
    if (!isDisabled(event)) {
        ipcRenderer.send('close')
    }
}

export { minimize, expand, close }