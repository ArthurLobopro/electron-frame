import { ipcRenderer } from "electron"
import { injectCSS } from "electron-css-injector"
import path from "path"
import { format } from "./Util"
import { icons } from "./icons"
import { styles_dir } from "./paths"

import NunitoFont from "@electron-fonts/nunito"

NunitoFont.inject()

export interface BaseFrameOptions {
    darkMode: boolean
    minimizable: boolean
    maximizable: boolean
    closeable: boolean
    colors: frameColors
    frameStyle: frameStyle
    onClose?: {
        beforeCallback?: () => boolean | Promise<boolean>
    }
    tabIndex?: boolean
}

export interface frameColors {
    background?: string
    color?: string
    svgIconsColor?: string
    svgIconsColorHover?: string
    lastSvgIconHover?: string
}

export interface windowConfig {
    minimizable: boolean
    maximizable: boolean
    closeable: boolean
}

type buildButtonType = "close" | "minimize" | "expand"

export type frameStyle = "windows" | "macos"
export abstract class Frame {
    frame!: HTMLDivElement
    options!: BaseFrameOptions

    constructor() { }

    protected abstract __build(): void

    protected abstract __setEvents(): void

    protected __buildButton(type: buildButtonType) {
        const button = document.createElement('button')
        button.id = type

        button.classList.add("frame-button")

        const isDisabled = () => {
            switch (type) {
                case "close":
                    return !this.closeable
                case "minimize":
                    return !this.minimizable
                case "expand":
                    return !this.maximizable
            }
        }

        if (isDisabled()) {
            button.classList.add("disable")
        }

        if (!this.options.tabIndex) {
            button.tabIndex = -1
        }

        if (type === "expand" && this.frameStyle === "macos") {
            button.innerHTML = this.__icons.expand
        } else {
            button.innerHTML = this.__icons[type]
        }

        const clickFunction = this[`__${type}`].bind(this)

        button.addEventListener('click', clickFunction)

        return button
    }

    protected __buildStyle() {
        const { colors = {} } = this.options

        const colorsArray = Object.entries(colors)
        const properties = colorsArray.map(([key, value]) => `--${format(key)} : ${value} !important`).join(';')

        const style = document.createElement('style')
        style.innerHTML = `#electron-frame.custom {${properties}}`

        return style
    }

    protected __updateStyle() {
        const new_style = this.__buildStyle()
        const old_style = this.frame.querySelector('style') as HTMLStyleElement

        old_style.replaceWith(new_style)

        if (!this.frame.classList.contains("custom")) {
            this.frame.classList.add("custom")
        }
    }

    protected __toggleExpandIcon() {
        if (this.frameStyle === "macos") {
            //Delay necessary to avoid a bug
            setTimeout(() => {
                const old_expand_button = this.frame.querySelector("#expand") as HTMLButtonElement

                const new_expand_button = this.__buildButton("expand")

                old_expand_button.replaceWith(new_expand_button)
            }, 30)
        }
    }

    //Actions (minimize, expand, close)
    protected async __close() {
        if (this.closeable) {
            if (typeof this.options.onClose?.beforeCallback === "function") {
                const result = this.options.onClose?.beforeCallback()

                if (result instanceof Promise) {
                    if (await result) {
                        ipcRenderer.send('electron-frame:close')
                    }
                } else if (result) {
                    ipcRenderer.send('electron-frame:close')
                }

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

    protected get __icons() {
        const expand = this.frameStyle === "windows" ?
            icons.windows.expand :
            this.isMaximized ? icons.macos.restore : icons.macos.expand

        return {
            close: icons[this.frameStyle].close,
            minimize: icons[this.frameStyle].minimize,
            expand
        }
    }

    insert() {
        //Rebuild with DOM content
        this.__build()
        injectCSS(path.join(styles_dir, 'main.css'))
        document.body.appendChild(this.frame)
        this.__setEvents()
    }

    remove() {
        this.frame.remove()
    }

    update() {
        const hasFrame = Array.from(document.body.childNodes).includes(this.frame)

        hasFrame && this.remove()

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

    setBeforeCloseCallback(callback?: () => boolean | Promise<boolean>) {
        this.options.onClose = {
            beforeCallback: callback
        }
    }

    get isMaximized() {
        return ipcRenderer.sendSync('electron-frame:is-maximized') as boolean
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