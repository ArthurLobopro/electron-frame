import { icons } from "./icons"
import { format, injectCSS } from "./Util"

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

interface frameColors {
    background?: string
    color?: string
    svgIconsColor?: string
    svgIconsColorHover?: string
    lastSvgIconHover?: string
}

type frameStyle = "windows" | "macos"

export abstract class Frame {
    options!: BaseFrameOptions
    frame!: HTMLDivElement

    constructor() { }

    abstract _build(): void

    abstract _setEvents(): void

    _buildStyle() {
        const { colors = {} } = this.options

        const colorsArray = Object.entries(colors)
        const properties = colorsArray.map(([key, value]) => `--${format(key)} : ${value} !important`).join(';')

        return properties
    }

    _updateStyle() {
        const properties = this._buildStyle()
        const styleTag = this.frame.querySelector('style') as HTMLElement
        styleTag.innerHTML = `#electron-frame.custom {${properties}}`

        if (!this.frame.classList.contains("custom")) {
            this.frame.classList.add("custom")
        }
    }

    async insert() {
        //Rebuild with DOM content
        this._build()

        injectCSS(__dirname, 'style.css')
        document.body.appendChild(this.frame)
        this._setEvents()
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

    toggleExpandIcon() {
        if (this.frameStyle === "macos") {
            const expand_div = this.frame.querySelector("#expand") as HTMLElement
            //Ao inserir o svg dentro de um elemento html ele muda, isso é realmente necessário para comparação
            const temp_div = document.createElement('div')
            temp_div.innerHTML = icons.macos.expand
            expand_div.innerHTML = expand_div.innerHTML.trim() == temp_div.innerHTML.trim() ? icons.macos.restore : icons.macos.expand
        }
    }

    setFrameStyle(frameStyle: "windows" | "macos") {
        if (frameStyle !== this.options.frameStyle) {
            this.options.frameStyle = frameStyle
            this.update()
        }
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