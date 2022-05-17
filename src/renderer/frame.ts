import path from 'path'
import { loadSVG, getIconString, injectCSS } from './Util'
import { minimize, expand, close as closeWindow } from './renderer-actions'
import { ipcRenderer } from 'electron'

const assetsFolder = path.resolve(__dirname, "assets")

interface frameColors {
    background?: string
    color?: string
    svgIconsColor?: string
    svgIconsColorHover?: string
    lastSvgIconHover?: string
}

type frameStyle = "windows" | "macos"

interface makeFrameOptions {
    darkMode?: boolean
    title?: string
    icon?: HTMLImageElement | string
    minimizable: boolean
    maximizable: boolean
    closeable: boolean
    colors?: frameColors
    frameStyle?: frameStyle
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

const format = (str: string) => str.replaceAll(/([A-Z])/g, s => `-${s.toLowerCase()}`)

export async function makeFrame(frameOptions: makeFrameOptions) {
    return new electronFrame(frameOptions).frame
}

export class electronFrame {
    frame!: HTMLDivElement
    options: frameOptions
    constructor(frameOptions: makeFrameOptions) {
        const windowConfig = ipcRenderer.sendSync('request-window-config') as windowConfig
        const defaultConfig: makeFrameOptions = {
            darkMode: true,
            colors: {},
            frameStyle: "windows",
            title: document.title,
            icon: "",
            onClose: { beforeCallback() { return true }, },
            ...windowConfig
        }
        this.options = { ...defaultConfig, ...frameOptions } as frameOptions
        this._build()
    }

    private _setEvents() {
        const frameGet = (id: string) => this.frame.querySelector(`#${id}`) as HTMLElement

        const close = (event: MouseEvent) => {
            const canClose = this?.options?.onClose?.beforeCallback ? this.options.onClose.beforeCallback() : true

            if (canClose) {
                closeWindow(event)
            }
        }

        frameGet('minimize').onclick = minimize
        frameGet('expand').onclick = expand
        frameGet('close').onclick = close
    }

    private _build() {
        const {
            title, icon,
            darkMode = true, minimizable = true, maximizable = true, closeable = true,
            colors = {},
            frameStyle
        } = this.options

        const colorsArray = Object.entries(colors)

        const properties = this._buildStyle()

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

        frame.innerHTML = `
        <div id="window-icon">${windowIconString instanceof Image ? windowIconString.outerHTML : windowIconString}</div>
        <div id="window-name">${name}</div>
        
        <div class="window-controls">
            <div id="minimize" class="frame-button ${minimizable ? "" : "disable"}">
                ${isWindowsStyle ? loadSVG(assetsFolder, 'minimize.svg') : ""}
            </div>
            <div id="expand" class="frame-button ${maximizable ? "" : "disable"}">
                ${isWindowsStyle ? loadSVG(assetsFolder, 'square.svg') : ""}
            </div>
            <div id="close" class="frame-button ${closeable ? "" : "disable"}">
                ${isWindowsStyle ? loadSVG(assetsFolder, 'close.svg') : ""}
            </div>
        </div>

        <style>
            #electron-frame.custom {
                ${properties}
            }
        </style>`

        this.frame = frame
        this._setEvents()
    }

    private _buildStyle() {
        const { colors = {} } = this.options

        const colorsArray = Object.entries(colors)
        const properties = colorsArray.map(([key, value]) => `--${format(key)} : ${value} !important`).join(';')

        return properties
    }

    private _updateStyle() {
        const properties = this._buildStyle()
        const styleTag = this.frame.querySelector('style') as HTMLElement
        styleTag.innerHTML = `#electron-frame.custom {${properties}}`

        if (!this.frame.classList.contains("custom")) {
            this.frame.classList.add("custom")
        }
    }

    setTitle(title: string) {
        this.options.title = title
        this.update()
    }

    setIcon(icon: HTMLImageElement | string) {
        this.options.icon = icon
        this.update()
    }

    async insert() {
        //Rebuild with DOM content
        this._build()

        injectCSS(__dirname, 'style.css')
        document.body.appendChild(this.frame)

        //This delay is necessary, dont quest
        setTimeout(() => {
            const bodyPaddingTop = getComputedStyle(document.body).paddingTop
            const frameHeight = getComputedStyle(this.frame).height
            document.body.style.paddingTop = `calc(${bodyPaddingTop} + ${frameHeight})`
        }, 50);
    }

    remove() {
        document.body.removeChild(this.frame)
    }

    update() {
        if (document.querySelector("#electron-frame")) {
            this.remove()
        }
        this._build()
        document.body.appendChild(this.frame)
    }

    setFrameStyle(frameStyle: "windows" | "macos") {
        if (frameStyle !== this.options.frameStyle) {
            this.options.frameStyle = frameStyle
            this.update()
        }
    }

    setColors(colors: frameColors) {
        this.options.colors = {
            ...this.options.colors,
            ...colors
        }
        this._updateStyle()
    }

    get colors() {
        return this.options.colors
    }

    get frameStyle() {
        return this.options.frameStyle
    }

    get title() {
        return this.options.title
    }

    set colors(colors: frameColors) {
        this.setColors(colors)
    }

    set title(title: string) {
        this.setTitle(title)
    }

    set frameStyle(frameStyle: frameStyle) {
        this.setFrameStyle(frameStyle)
    }
}