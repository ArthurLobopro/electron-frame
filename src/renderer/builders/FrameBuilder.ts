import { Frame } from "../frames/Frame"
import { icons } from "../icons"
import { formatCSS } from "../Util"

type BuildButtonType = "close" | "minimize" | "expand"

export abstract class FrameBuilder {
    constructor(protected frame: Frame) { }

    abstract build(): void

    updateStyle() {
        const new_style = this.__buildStyle()
        const old_style = this.frame.frame.querySelector('style') as HTMLStyleElement

        old_style.replaceWith(new_style)

        if (!this.frame.frame.classList.contains("custom")) {
            this.frame.frame.classList.add("custom")
        }
    }

    updateButtons() {
        const types = ["close", "minimize", "expand"] as const
        types.forEach((buttonType) => {
            const oldBtn = this.frame.frame.querySelector(`#${buttonType}`)

            oldBtn?.replaceWith(this.__buildButton(buttonType))
        })
    }

    protected get __icons() {
        const expand = this.frame.frameStyle === "windows" ?
            icons.windows.expand :
            this.frame.isMaximized ? icons.macos.restore : icons.macos.expand

        return {
            close: icons[this.frame.frameStyle].close,
            minimize: icons[this.frame.frameStyle].minimize,
            expand
        }
    }

    protected __buildButton(type: BuildButtonType) {
        const button = document.createElement('button')
        button.id = type

        button.classList.add("frame-button")

        const isDisabled = () => {
            switch (type) {
                case "close":
                    return !this.frame.closeable
                case "minimize":
                    return !this.frame.minimizable
                case "expand":
                    return !this.frame.maximizable
            }
        }

        if (isDisabled()) {
            button.classList.add("disable")
        }

        if (!this.frame.options.tabIndex) {
            button.tabIndex = -1
        }

        if (type === "expand" && this.frame.frameStyle === "macos") {
            button.innerHTML = this.__icons.expand
        } else {
            button.innerHTML = this.__icons[type]
        }

        const clickFunction = () => this.frame.actions[type]()

        button.addEventListener('click', clickFunction)

        return button
    }

    protected __buildStyle() {
        const { colors = {} } = this.frame.options

        const colorsArray = Object.entries(colors)
        const properties = colorsArray.map(([key, value]) => `--${formatCSS(key)} : ${value} !important`).join(';')

        const style = document.createElement('style')
        style.innerHTML = `#electron-frame.custom {${properties}}`

        return style
    }
}