import { ipcRenderer } from 'electron'
import { ElectronFrame } from "./ElectronFrame"
import { PopUpFrame } from "./PopUpFrame"

export const actions = {
    close(frame: ElectronFrame | PopUpFrame) {
        if (frame.closeable) {
            if (frame.options.onClose?.beforeCallback) {
                frame.options.onClose?.beforeCallback() ? ipcRenderer.send('close') : void 0
            } else {
                ipcRenderer.send('electron-frame:close')
            }
        }
    },

    expand(frame: ElectronFrame | PopUpFrame) {
        if (frame.maximizable) {
            ipcRenderer.send('electron-frame:expand')
            frame.toggleExpandIcon()
        }
    },

    minimize(frame: ElectronFrame | PopUpFrame) {
        frame.minimizable ? ipcRenderer.send('electron-frame:minimize') : void 0
    }
}
