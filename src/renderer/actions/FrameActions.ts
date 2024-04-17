import { ipcFrameApi } from "../api"
import { Frame } from "../frames/Frame"

export class FrameActions {
    constructor(protected frame: Frame) { }

    expand() {
        if (this.frame.maximizable) {
            ipcFrameApi.expandWindow()
        }
    }

    minimize() {
        if (this.frame.minimizable) {
            ipcFrameApi.minimizeWindow()
        }
    }

    async close() {
        if (this.frame.closeable) {
            if (typeof this.frame.options.onClose?.beforeCallback === "function") {
                const result = this.frame.options.onClose?.beforeCallback()

                if (result instanceof Promise) {
                    if (await result) {
                        ipcFrameApi.closeWindow()
                    }
                } else if (result) {
                    ipcFrameApi.closeWindow()
                }

            } else {
                ipcFrameApi.closeWindow()
            }
        }
    }
} 