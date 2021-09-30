import { ipcMain, BrowserWindow } from 'electron'

const mainWindowControlEvents = {
    init() {
        ipcMain.on('minimize', () => {
            const win = BrowserWindow.getFocusedWindow()
            win.minimize()
        })

        ipcMain.on('expand', () => {
            const win = BrowserWindow.getFocusedWindow()
            if (win.isMaximized()) {
                win.restore()
            } else {
                win.maximize()
            }
        })

        ipcMain.on('close', () => {
            const win = BrowserWindow.getFocusedWindow()
            win.close()
        })
    }
}

export { mainWindowControlEvents }