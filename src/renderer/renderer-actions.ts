const { ipcRenderer } = require('electron')

const minimize = () => ipcRenderer.send('minimize')

const expand = () => ipcRenderer.send('expand')

const close = () => ipcRenderer.send('close')

export { minimize, expand, close }