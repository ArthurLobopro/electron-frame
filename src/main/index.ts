import { ipcMain, BrowserWindow } from 'electron'

ipcMain.on('minimize', () => {
    const win = BrowserWindow.getFocusedWindow()
    win?.minimize()
})

ipcMain.on('expand', () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win?.isMaximized()) {
        win?.restore()
    } else {
        win?.maximize()
    }
})

ipcMain.on('close', () => {
    const win = BrowserWindow.getFocusedWindow()
    win?.close()
})

ipcMain.on('request-window-config', (event) => {
    const win = BrowserWindow.getFocusedWindow()
    const minimizable = win?.isMinimizable()
    const maximizable = win?.isMaximizable()
    const closeable = win?.isClosable()
    event.returnValue = { minimizable, maximizable, closeable }
})