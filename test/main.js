const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")

const { mainWindowControlEvents } = require('../npm/main')
mainWindowControlEvents.init()

function mainWindow() {
    const win = new BrowserWindow({
        frame: false,
        maximizable: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "preload.js")
        }
    })
    win.loadFile("index.html")
}

app.whenReady().then(mainWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        mainWindow()
    }
})