import path from 'path'
import { loadSVG, getIconString, injectCSS } from './Util'
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

const actions = {
    close(frame: electronFrame) {
        if (frame.closeable) {
            if (frame.options.onClose?.beforeCallback) {
                frame.options.onClose?.beforeCallback() ? ipcRenderer.send('close') : void 0
            } else {
                ipcRenderer.send('close')
            }
        }
    },
    expand(frame: electronFrame) {
        if (frame.maximizable) {
            ipcRenderer.send('expand')
            frame.toggleExpandIcon()
        }
    },
    minimize(frame: electronFrame) {
        frame.minimizable ? ipcRenderer.send('minimize') : void 0
    }
}

const icons = {
    macos: {
        minimize: loadSVG(assetsFolder, "mac-minimize.svg").toString(),
        expand: loadSVG(assetsFolder, "mac-expand.svg").toString(),
        close: loadSVG(assetsFolder, "mac-close.svg").toString(),
        restore: loadSVG(assetsFolder, "mac-restore.svg").toString()
    },
    windows: {
        minimize: loadSVG(assetsFolder, "win-minimize.svg").toString(),
        expand: loadSVG(assetsFolder, "win-expand.svg").toString(),
        close: loadSVG(assetsFolder, "win-close.svg").toString()
    }
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

        frameGet('minimize').onclick = () => actions.minimize(this)
        frameGet('expand').onclick = () => actions.expand(this)
        frameGet('close').onclick = () => actions.close(this)
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

        const iconProvider = isWindowsStyle ? icons.windows : icons.macos

        frame.innerHTML = `
        <div id="window-icon">${windowIconString instanceof Image ? windowIconString.outerHTML : windowIconString}</div>
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
        this._setEvents()
    }

    toggleExpandIcon() {
        if (this.frameStyle === "macos") {
            const expand_div = this.frame.querySelector("#expand") as HTMLElement
            //Ao inserir o svg dentro de um elemento html ele muda, isso ?? realmente necess??rio para compara????o
            const temp_div = document.createElement('div')
            temp_div.innerHTML = icons.macos.expand
            expand_div.innerHTML = expand_div.innerHTML.trim() == temp_div.innerHTML.trim() ? icons.macos.restore : icons.macos.expand
        }
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
        this.frame.remove()
    }

    update() {
        const hasFrame = Array.from(document.body.childNodes).includes(this.frame)
        if (hasFrame) {
            this.remove()
        }

        this._build()

        if (hasFrame) {
            document.body.appendChild(this.frame)
        }
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