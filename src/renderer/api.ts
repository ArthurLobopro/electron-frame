import { ipcRenderer } from "electron"
import { FrameEvents } from "../FrameEvents"
import { WindowConfig } from "./frames/Frame"

export const ipcFrameApi = {
    isMaximized() {
        return ipcRenderer.sendSync(FrameEvents.getIsMazimized) as boolean
    },

    getWindowConfig() {
        return ipcRenderer.sendSync('electron-frame:request-window-config') as WindowConfig
    },

    closeWindow() {
        return ipcRenderer.send(FrameEvents.onClose)
    },

    expandWindow() {
        return ipcRenderer.send(FrameEvents.onExpand)
    },

    minimizeWindow() {
        return ipcRenderer.send(FrameEvents.onMinimize)
    },
}

export type ipcFrameApi = typeof ipcFrameApi