import { contextBridge, ipcRenderer } from "electron"
import { FrameEvents } from "./FrameEvents"
import type { windowConfig } from "./renderer/Frame"

export class FrameApi {
    isMaximized() {
        return ipcRenderer.sendSync(FrameEvents.getIsMazimized) as boolean
    }

    getWindowConfig() {
        return ipcRenderer.sendSync('electron-frame:request-window-config') as windowConfig
    }

    closeWindow() {
        return ipcRenderer.send(FrameEvents.onClose)
    }

    expandWindow() {
        return ipcRenderer.send(FrameEvents.onExpand)
    }

    minimizeWindow() {
        return ipcRenderer.send(FrameEvents.onMinimize)
    }
}

contextBridge.exposeInMainWorld("FrameApi", new FrameApi())