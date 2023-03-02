import { ipcRenderer } from "electron"
import { format, injectCSS } from "./Util"
import { icons } from "./icons"

export interface BaseFrameOptions {
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

export interface frameColors {
    background?: string
    color?: string
    svgIconsColor?: string
    svgIconsColorHover?: string
    lastSvgIconHover?: string
}

export type frameStyle = "windows" | "macos"
export abstract class Frame {
    options!: BaseFrameOptions
    frame!: HTMLDivElement

    constructor() { }

    protected abstract __build(): void

    protected abstract __setEvents(): void

    protected __buildStyle() {
        const { colors = {} } = this.options

        const colorsArray = Object.entries(colors)
        const properties = colorsArray.map(([key, value]) => `--${format(key)} : ${value} !important`).join(';')

        return properties
    }

    protected __updateStyle() {
        const properties = this.__buildStyle()
        const styleTag = this.frame.querySelector('style') as HTMLElement
        styleTag.innerHTML = `#electron-frame.custom {${properties}}`

        if (!this.frame.classList.contains("custom")) {
            this.frame.classList.add("custom")
        }
    }

    protected __toggleExpandIcon() {
        if (this.frameStyle === "macos") {
            const expand_div = this.frame.querySelector("#expand") as HTMLElement
            const isMaximized = ipcRenderer.sendSync('electron-frame:is-maximized')
            expand_div.innerHTML = isMaximized ? icons.macos.restore : icons.macos.expand
        }
    }

    //Actions (minimize, expand, close)
    protected __close() {
        if (this.closeable) {
            if (this.options.onClose?.beforeCallback) {
                this.options.onClose?.beforeCallback() ? ipcRenderer.send('close') : void 0
            } else {
                ipcRenderer.send('electron-frame:close')
            }
        }
    }

    protected __expand() {
        if (this.maximizable) {
            ipcRenderer.send('electron-frame:expand')
            this.__toggleExpandIcon()
        }
    }

    protected __minimize() {
        if (this.minimizable) {
            ipcRenderer.send('electron-frame:minimize')
        }
    }

    insert() {
        //Rebuild with DOM content
        this.__build()
        injectCSS(__dirname, './styles/main.css')
        document.body.appendChild(this.frame)
        this.__setEvents()
    }

    remove() {
        this.frame.remove()
    }

    update() {
        const hasFrame = Array.from(document.body.childNodes).includes(this.frame)
        if (hasFrame) {
            this.remove()
        }

        this.insert()
    }

    toggleDarkMode() {
        this.frame.classList.toggle("dark")
        this.options.darkMode = !this.options.darkMode
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
        this.__updateStyle()
    }

    get colors() {
        return this.options.colors
    }

    get darkmode() {
        return this.options.darkMode
    }

    set colors(colors: frameColors) {
        this.setColors(colors)
    }

    set frameStyle(frameStyle: frameStyle) {
        this.setFrameStyle(frameStyle)
    }

    get frameStyle() {
        return this.options.frameStyle
    }

    get closeable() {
        return this.options.closeable
    }

    get maximizable() {
        return this.options.maximizable
    }

    get minimizable() {
        return this.options.minimizable
    }
}