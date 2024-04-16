import { BrowserWindow, ipcMain } from 'electron'

import "electron-css-injector/main"
import { FrameEvents } from "../FrameEvents"

ipcMain.on(FrameEvents.minimize, (event) => {
    const win = BrowserWindow.fromId(event.sender.id)
    win?.minimize()
})

ipcMain.on(FrameEvents.toggleExpand, (event) => {
    const win = BrowserWindow.fromId(event.sender.id)
    if (win?.isMaximized()) {
        win?.unmaximize()
    } else {
        win?.maximize()
    }
})

ipcMain.on(FrameEvents.close, (event) => {
    const win = BrowserWindow.fromId(event.sender.id)
    win?.close()
})

ipcMain.on(FrameEvents.getIsMazimized, (event) => {
    const win = BrowserWindow.fromId(event.sender.id)
    event.returnValue = win?.isMaximized()
})

ipcMain.on(FrameEvents.getWindowConfig, (event) => {
    const win = BrowserWindow.fromId(event.sender.id)
    const minimizable = win?.minimizable
    const maximizable = win?.maximizable
    const closeable = win?.closable
    event.returnValue = { minimizable, maximizable, closeable }
})

ipcMain.on(FrameEvents.listenToggleExpand, (event) => {
    const win = BrowserWindow.fromId(event.sender.id)

    win?.on("maximize", () => {
        win.webContents.send(FrameEvents.onToggleExpand)
    })

    win?.on("unmaximize", () => {
        win.webContents.send(FrameEvents.onToggleExpand)
    })
})