import { injectCSS } from "electron-css-injector"
import path from "path"
import { ipcFrameApi } from "../api"
import { styles_dir } from "../paths"

import NunitoFont from "@electron-fonts/nunito"
import { FrameActions } from "../actions/FrameActions"
import { FrameBuilder } from "../builders/FrameBuilder"

NunitoFont.inject()

export interface FrameColors {
    background?: string
    color?: string
    svgIconsColor?: string
    svgIconsColorHover?: string
    lastSvgIconHover?: string
}

export type FrameStyle = "windows" | "macos"

export interface WindowConfig {
    minimizable: boolean
    maximizable: boolean
    closeable: boolean
}

export interface BaseFrameOptions extends WindowConfig {
    darkMode: boolean
    colors: FrameColors
    frameStyle: FrameStyle
    onClose?: {
        beforeCallback?: () => boolean | Promise<boolean>
    }
    tabIndex?: boolean
}

export interface MakeBaseFrameOptions extends Partial<BaseFrameOptions> {
    autoInsert?: boolean
}

type buildButtonType = "close" | "minimize" | "expand"

export abstract class Frame
    <
        Options extends BaseFrameOptions = BaseFrameOptions,
        MakeOptions extends MakeBaseFrameOptions = MakeBaseFrameOptions
    > {
    frame!: HTMLDivElement
    options!: Options
    abstract actions: FrameActions
    abstract builder: FrameBuilder

    protected __init(frameOptions?: MakeOptions) {
        const autoInsert = frameOptions?.autoInsert || false
        delete frameOptions?.autoInsert

        this.__resolveOptions(frameOptions)
        this.__build()

        if (autoInsert) {
            this.insert()
        }
    }

    protected abstract __resolveOptions(options?: MakeOptions): void

    protected abstract __build(): void

    protected __getWindowConfig() {
        return ipcFrameApi.getWindowConfig()
    }

    insert() {
        //Rebuild with DOM content
        this.__build()
        injectCSS(path.join(styles_dir, 'main.css'))
        document.body.appendChild(this.frame)
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

    setColors(colors: FrameColors) {
        this.options.colors = {
            ...this.options.colors,
            ...colors
        }
        this.builder.updateStyle()
    }

    setBeforeCloseCallback(callback?: () => boolean | Promise<boolean>) {
        this.options.onClose = {
            beforeCallback: callback
        }
    }

    get isMaximized() {
        return ipcFrameApi.isMaximized()
    }

    get colors() {
        return this.options.colors
    }

    get darkmode() {
        return this.options.darkMode
    }

    set colors(colors: FrameColors) {
        this.setColors(colors)
    }

    set frameStyle(frameStyle: FrameStyle) {
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