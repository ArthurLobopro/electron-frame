import { ipcRenderer } from 'electron'
import { Frame, frameStyle, windowConfig } from "./Frame"
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
    tabIndex?: boolean
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

export class ElectronFrame extends Frame {
    options: frameOptions

    constructor(frameOptions: makeElectronFrameOptions = {}) {
        super()

        const windowConfig = ipcRenderer.sendSync('electron-frame:request-window-config') as windowConfig

        const defaultConfig: makeElectronFrameOptions = {
            darkMode: true,
            colors: {},
            frameStyle: "windows",
            icon: getIconString(),
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

        const windowIconString = icon || getIconString()

        const name = title || document.title

        const isWindowsStyle = frameStyle === "windows"

        const frame = document.createElement('div')
        frame.id = "electron-frame"

        frame.classList.add(darkMode ? "dark" : "light")
        frame.classList.add(isWindowsStyle ? "windows-style" : "macos-style")

        if (!colorsArray.length) {
            frame.classList.add('custom')
        }

        const frameIcon = document.createElement('div')
        frameIcon.id = isWindowsStyle ? "window-icon" : "spacer"

        if (isWindowsStyle) {
            if (windowIconString instanceof Image) {
                frameIcon.appendChild(windowIconString)
            } else {
                const image = new Image()
                image.src = windowIconString

                frameIcon.appendChild(image)
            }
        }

        const windowName = document.createElement('div')
        windowName.id = "window-name"
        windowName.innerText = name

        frame.appendChild(frameIcon)
        frame.appendChild(windowName)
        frame.appendChild(this.__buildControls())
        frame.appendChild(this.__buildStyle())

        this.frame = frame
    }

    private __buildControls() {
        const controls = document.createElement('div')
        controls.className = "window-controls"

        controls.appendChild(this.__buildButton("minimize"))
        controls.appendChild(this.__buildButton("expand"))
        controls.appendChild(this.__buildButton("close"))

        return controls
    }

    protected __setEvents(): void { }

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