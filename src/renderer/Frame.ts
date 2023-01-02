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

    abstract __build(): void

    abstract __setEvents(): void

    __buildStyle() {
        const { colors = {} } = this.options

        const colorsArray = Object.entries(colors)
        const properties = colorsArray.map(([key, value]) => `--${format(key)} : ${value} !important`).join(';')

        return properties
    }

    __updateStyle() {
        const properties = this.__buildStyle()
        const styleTag = this.frame.querySelector('style') as HTMLElement
        styleTag.innerHTML = `#electron-frame.custom {${properties}}`

        if (!this.frame.classList.contains("custom")) {
            this.frame.classList.add("custom")
        }
    }

    insert() {
        //Rebuild with DOM content
        this.__build()
        injectCSS(__dirname, 'style.css')
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

    toggleExpandIcon() {
        if (this.frameStyle === "macos") {
            const expand_div = this.frame.querySelector("#expand") as HTMLElement
            //Ao inserir o svg dentro de um elemento html ele muda, isso é realmente necessário para comparação
            const temp_div = document.createElement('div')
            temp_div.innerHTML = icons.macos.expand
            expand_div.innerHTML = expand_div.innerHTML.trim() == temp_div.innerHTML.trim() ? icons.macos.restore : icons.macos.expand
        }
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