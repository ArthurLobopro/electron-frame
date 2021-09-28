const { ipcMain, BrowserWindow } = require('electron')

const mainWindowControlEvents = {
    init() {
        ipcMain.on('minimize', (event, arg) => {
            const win = BrowserWindow.getFocusedWindow()
            win.minimize()
        })

        ipcMain.on('expand', (event, arg) => {
            const win = BrowserWindow.getFocusedWindow()
            if (win.isMaximized()) {
                win.restore()
            } else {
                win.maximize()
            }
        })

        ipcMain.on('close', (event, isMacOS = process.platform == "darwin") => {
            const win = BrowserWindow.getFocusedWindow()
            win.close()
        })
    }
}

module.exports = { mainWindowControlEvents }