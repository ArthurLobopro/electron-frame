import { ipcRenderer } from "electron"
import { Frame, frameColors, frameStyle } from "./Frame"
import { actions } from "./actions"
import { icons } from "./icons"

interface makePopUpFrameOptions {
    darkMode?: boolean
    minimizable?: boolean
    maximizable?: boolean
    closeable?: boolean
    colors?: frameColors
    frameStyle?: frameStyle
    autoInsert?: boolean
    onClose?: {
        beforeCallback?: () => true | false
    }
}

interface windowConfig {
    minimizable: boolean
    maximizable: boolean
    closeable: boolean
}

interface PopUpFrameOptions {
    darkMode: boolean
    minimizable: boolean
    maximizable: boolean
    closeable: boolean
    colors: frameColors
    frameStyle: frameStyle
    onClose?: {
        beforeCallback?: () => true | false
    }
}

export class PopUpFrame extends Frame {

    frame!: HTMLDivElement
    options: PopUpFrameOptions

    constructor(frameOptions: makePopUpFrameOptions = {}) {
        super()
        const windowConfig = ipcRenderer.sendSync('request-window-config') as windowConfig
        const defaultConfig: makePopUpFrameOptions = {
            darkMode: true,
            colors: {},
            frameStyle: "windows",
            onClose: { beforeCallback() { return true }, },
            ...windowConfig
        }

        const autoInsert = frameOptions?.autoInsert || false
        delete frameOptions.autoInsert

        this.options = { ...defaultConfig, ...frameOptions } as PopUpFrameOptions
        this.__build()

        if (autoInsert) {
            this.insert()
        }
    }

    __build() {

        if (process.platform === "linux") {
            throw new Error("PopUpFrame is not supported on Linux")
        }

        const {
            darkMode = true, minimizable = true, maximizable = true, closeable = true,
            colors = {},
            frameStyle
        } = this.options

        const properties = this.__buildStyle()

        const isWindowsStyle = frameStyle === "windows"

        const PopUpFrame = document.createElement('div')
        PopUpFrame.id = 'electron-popup-frame'

        PopUpFrame.classList.add(darkMode ? "dark" : "light")
        PopUpFrame.classList.add(isWindowsStyle ? "windows-style" : "macos-style")

        PopUpFrame.innerHTML = `
        <div id="minimize" class="frame-button ${minimizable ? "" : "disable"}">
            ${icons[frameStyle].minimize}
        </div>
        <div id="expand" class="frame-button ${maximizable ? "" : "disable"}">
            ${icons[frameStyle].expand}
        </div>
        <div id="close" class="frame-button ${closeable ? "" : "disable"}">
            ${icons[frameStyle].close}
        </div>
        
        <style>
            #electron-frame.custom {
                ${properties}
            }
        </style>`

        this.frame = PopUpFrame
        this.__setEvents()
    }

    __setEvents() {
        const frameGet = (id: string) => this.frame.querySelector(`#${id}`) as HTMLElement

        const hideMenu = () => this.frame.classList.remove('active')

        frameGet('minimize').onclick = () => {
            actions.minimize(this)
            hideMenu()
        }
        frameGet('expand').onclick = () => {
            actions.expand(this)
            hideMenu()
        }
        frameGet('close').onclick = () => {
            actions.close(this)
            hideMenu()
        }

        const windowsMouseMove = ({ pageX, pageY, x, y, height }: { pageX: number, pageY: number, x: number, y: number, height: number }) => {
            if (pageY <= 10 && pageX > x) {
                if (!this.frame.classList.contains('active')) {
                    this.frame.classList.add('active')
                }
            }

            if (pageY > y + height + 10 || pageX < x) {
                if (this.frame.classList.contains('active')) {
                    hideMenu()
                }
            }
        }

        const macosMouseMove = ({ pageY, pageX, x, y, height, width }: { pageX: number, pageY: number, x: number, y: number, height: number, width: number }) => {
            if (pageY <= 10 && pageX < x + width) {
                if (!this.frame.classList.contains('active')) {
                    this.frame.classList.add('active')
                }
            }

            if (pageY > y + height + 15 || pageX > x + width + 10) {
                if (this.frame.classList.contains('active')) {
                    hideMenu()
                }
            }
        }

        window.addEventListener('mousemove', event => {
            const { pageX, pageY } = event
            const { x, height, y, width } = this.frame.getBoundingClientRect()

            this.options.frameStyle === "windows" ? windowsMouseMove({ pageX, pageY, x, y, height }) : macosMouseMove({ pageX, pageY, x, y, height, width })
        })
    }
}