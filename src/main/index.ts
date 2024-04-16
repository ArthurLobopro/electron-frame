import { BrowserWindow, ipcMain } from 'electron'

import "electron-css-injector/main"
import { FrameEvents } from "../FrameEvents"

ipcMain.on(FrameEvents.onMinimize, (event) => {
    const win = BrowserWindow.fromId(event.sender.id)
    win?.minimize()
})

ipcMain.on(FrameEvents.onExpand, (event) => {
    const win = BrowserWindow.fromId(event.sender.id)
    if (win?.isMaximized()) {
        win?.unmaximize()
    } else {
        win?.maximize()
    }
})

ipcMain.on(FrameEvents.onClose, (event) => {
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