import { ipcRenderer } from 'electron'
import { Frame, frameStyle } from "./Frame"
import { getIconString } from './Util'

interface frameColors {
    background?: string
    color?: string
    svgIconsColor?: string
    svgIconsColorHover?: string
    lastSvgIconHover?: string
}

export interface makeElectronFrameOptions {
    darkMode?: boolean
    title?: string
    icon?: HTMLImageElement | string
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

interface frameOptions {
    darkMode: boolean
    title: string
    /**
     * @description HTMLImageElement or a string with the path to the image.
     */
    icon: HTMLImageElement | string
    minimizable: boolean
    maximizable: boolean
    closeable: boolean
    colors: frameColors
    frameStyle: frameStyle
    onClose?: {
        beforeCallback?: () => true | false
    }
}

interface windowConfig {
    minimizable: boolean
    maximizable: boolean
    closeable: boolean
}

export class ElectronFrame extends Frame {
    options: frameOptions

    constructor(frameOptions: makeElectronFrameOptions = {}) {
        super()

        const windowConfig = ipcRenderer.sendSync('electron-frame:request-window-config') as windowConfig

        const defaultConfig: makeElectronFrameOptions = {
            darkMode: true,
            colors: {},
            frameStyle: "windows",
            icon: "",
            onClose: { beforeCallback() { return true }, },
            ...({ minimizable: true, maximizable: true, closeable: true }),
            ...windowConfig
        }

        const autoInsert = frameOptions.autoInsert || false

        delete frameOptions.autoInsert

        this.options = { ...defaultConfig, ...frameOptions } as frameOptions
        this.__build()

        if (autoInsert) {
            this.insert()
        }
    }

    protected __build() {
        const {
            title, icon,
            darkMode,
            colors = {},
            frameStyle
        } = this.options

        const colorsArray = Object.entries(colors)

        const properties = this.__buildStyle()

        const windowIconString = icon || getIconString()

        const frame = document.createElement('div')
        const name = title || document.title

        const isWindowsStyle = frameStyle === "windows"

        frame.id = "electron-frame"

        frame.classList.add(darkMode ? "dark" : "light")
        frame.classList.add(isWindowsStyle ? "windows-style" : "macos-style")

        if (!colorsArray.length) {
            frame.classList.add('custom')
        }

        const frameIcon = document.createElement('div')
        frameIcon.id = isWindowsStyle ? "window-icon" : "spacer"

        if (windowIconString instanceof Image) {
            frameIcon.appendChild(windowIconString)
        } else {
            const image = new Image()
            image.src = windowIconString

            frameIcon.appendChild(image)
        }

        frame.innerHTML = `
        ${frameIcon.outerHTML}
        <div id="window-name">${name}</div>
        
        ${this.__buildControls()}

        <style>
            #electron-frame.custom { ${properties} }
        </style>`

        this.frame = frame
        this.__setEvents()
    }

    private __buildControls() {
        const { minimizable, maximizable, closeable } = this.options

        return (
            `<div class="window-controls">
                <button id="minimize" class="frame-button ${minimizable ? "" : "disable"}">
                    ${this.__icons.minimize}
                </button>
                <button id="expand" class="frame-button ${maximizable ? "" : "disable"}">
                    ${this.__icons.expand}
                </button>
                <button id="close" class="frame-button ${closeable ? "" : "disable"}">
                    ${this.__icons.close}
                </button>
            </div>`
        )
    }

    protected __setEvents() {
        const frameGet = (id: string) => this.frame.querySelector(`#${id}`) as HTMLElement

        frameGet('minimize').onclick = () => this.__minimize()
        frameGet('expand').onclick = () => this.__expand()
        frameGet('close').onclick = () => this.__close()
    }

    insert(addPaddingTop = true) {
        super.insert()

        if (addPaddingTop) {
            document.body.style.paddingTop = `30px`
        }
    }

    remove(removePaddingTop = true) {
        if (removePaddingTop) {
            document.body.style.paddingTop = `0`
        }

        super.remove()
    }

    update() {
        const hasFrame = Array.from(document.body.childNodes).includes(this.frame)

        if (hasFrame) {
            this.remove(false)
        }

        this.insert(false)
    }

    updateWindowConfig() {
        const windowConfig = ipcRenderer.sendSync('electron-frame:request-window-config') as windowConfig

        if (process.platform === "linux") {
            console.log("Linux does not support 'updateWindowConfig', ignoring it...")
            return
        }

        this.options = { ...this.options, ...windowConfig }
        this.update()
    }

    setTitle(title: string) {
        this.options.title = title
        this.update()
    }

    setIcon(icon: HTMLImageElement | string) {
        this.options.icon = icon
        this.update()
    }

    get title() {
        return this.options.title
    }

    set title(title: string) {
        this.setTitle(title)
    }
}