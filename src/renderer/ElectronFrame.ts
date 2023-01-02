import path from 'path'
import { format, getIconString, injectCSS } from './Util'
import { ipcRenderer } from 'electron'
import { icons } from "./icons"
import { actions } from "./actions"
import { Frame } from "./Frame"

interface frameColors {
    background?: string
    color?: string
    svgIconsColor?: string
    svgIconsColorHover?: string
    lastSvgIconHover?: string
}

export type frameStyle = "windows" | "macos"

interface makeElectronFrameOptions {
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

    constructor(frameOptions: makeElectronFrameOptions) {
        super()
        const windowConfig = ipcRenderer.sendSync('request-window-config') as windowConfig
        const defaultConfig: makeElectronFrameOptions = {
            darkMode: true,
            colors: {},
            frameStyle: "windows",
            title: document.title,
            icon: "",
            onClose: { beforeCallback() { return true }, },
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

    __build() {
        const {
            title, icon,
            darkMode = true, minimizable = true, maximizable = true, closeable = true,
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

        if (colorsArray.length !== 0) {
            frame.classList.add('custom')
        }

        const iconProvider = isWindowsStyle ? icons.windows : icons.macos

        const frameIcon = this.options.frameStyle === "windows" ?
            `<div id="window-icon">${windowIconString instanceof Image ? windowIconString.outerHTML : windowIconString}</div>`
            : ""

        frame.innerHTML = `
        ${frameIcon}
        <div id="window-name">${name}</div>
        
        <div class="window-controls">
            <div id="minimize" class="frame-button ${minimizable ? "" : "disable"}">
                ${iconProvider.minimize}
            </div>
            <div id="expand" class="frame-button ${maximizable ? "" : "disable"}">
                ${iconProvider.expand}
            </div>
            <div id="close" class="frame-button ${closeable ? "" : "disable"}">
                ${iconProvider.close}
            </div>
        </div>

        <style>
            #electron-frame.custom {
                ${properties}
            }
        </style>`

        this.frame = frame
        this.__setEvents()
    }

    __setEvents() {
        const frameGet = (id: string) => this.frame.querySelector(`#${id}`) as HTMLElement

        frameGet('minimize').onclick = () => actions.minimize(this)
        frameGet('expand').onclick = () => actions.expand(this)
        frameGet('close').onclick = () => actions.close(this)
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

        console.log("remove")

        super.remove()
    }

    update() {
        const hasFrame = Array.from(document.body.childNodes).includes(this.frame)
        if (hasFrame) {
            this.remove(false)
        }

        this.insert(false)
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