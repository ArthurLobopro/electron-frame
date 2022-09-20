import { ipcMain, BrowserWindow } from 'electron'

ipcMain.on('minimize', (event) => {
    const win = BrowserWindow.fromId(event.sender.id)
    win?.minimize()
})

ipcMain.on('expand', (event) => {
    const win = BrowserWindow.fromId(event.sender.id)
    if (win?.isMaximized()) {
        win?.restore()
    } else {
        win?.maximize()
    }
})

ipcMain.on('close', (event) => {
    const win = BrowserWindow.fromId(event.sender.id)
    win?.close()
})

ipcMain.on('request-window-config', (event) => {
    const win = BrowserWindow.fromId(event.sender.id)
    const minimizable = win?.minimizable
    const maximizable = win?.maximizable
    const closeable = win?.closable
    event.returnValue = { minimizable, maximizable, closeable }
})