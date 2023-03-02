import { ipcMain, BrowserWindow } from 'electron'

ipcMain.on('electron-frame:minimize', (event) => {
    const win = BrowserWindow.fromId(event.sender.id)
    win?.minimize()
})

ipcMain.on('electron-frame:expand', (event) => {
    const win = BrowserWindow.fromId(event.sender.id)
    if (win?.isMaximized()) {
        win?.restore()
    } else {
        win?.maximize()
    }
})

ipcMain.on('electron-frame:close', (event) => {
    const win = BrowserWindow.fromId(event.sender.id)
    win?.close()
})

ipcMain.on('electron-frame:is-maximized', (event) => {
    const win: BrowserWindow = BrowserWindow.fromId(event.sender.id)
    event.returnValue = win?.isMaximized()
})

ipcMain.on('electron-frame:request-window-config', (event) => {
    const win = BrowserWindow.fromId(event.sender.id)
    const minimizable = win?.minimizable
    const maximizable = win?.maximizable
    const closeable = win?.closable
    event.returnValue = { minimizable, maximizable, closeable }
})