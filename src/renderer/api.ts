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
        return ipcRenderer.send(FrameEvents.close)
    },

    expandWindow() {
        return ipcRenderer.send(FrameEvents.toggleExpand)
    },

    minimizeWindow() {
        return ipcRenderer.send(FrameEvents.minimize)
    },

    addToggleMaximizeListener(handler: () => void) {
        ipcRenderer.send(FrameEvents.listenToggleExpand)

        ipcRenderer.on(FrameEvents.onToggleExpand, handler)
    }
}

export type ipcFrameApi = typeof ipcFrameApi