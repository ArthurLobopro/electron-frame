import { BaseFrameOptions, Frame } from "./Frame"
import { getIcon } from './Util'

interface ElectronFrameOptions extends BaseFrameOptions {
    title: string
    /**
     * @description HTMLImageElement or a string with the path to the image.
     */
    icon: HTMLImageElement | string
}

export interface MakeElectronFrameOptions extends Partial<ElectronFrameOptions> {
    autoInsert?: boolean
}

export class ElectronFrame extends Frame<ElectronFrameOptions, MakeElectronFrameOptions> {
    protected __resolveOptions(options: MakeElectronFrameOptions = {}) {
        const defaultWindowConfig = { minimizable: true, maximizable: true, closeable: true }

        const windowConfig = Object.assign({}, defaultWindowConfig, this.__getWindowConfig())

        const defaultConfig: MakeElectronFrameOptions = {
            darkMode: true,
            colors: {},
            frameStyle: "windows",
            icon: getIcon(),
            title: document.title,
            onClose: { beforeCallback() { return true }, },
            ...windowConfig,
        }

        this.options = {
            ...defaultConfig,
            ...options,
        } as ElectronFrameOptions
    }

    protected __build() {
        const frame = this.__buildFrame()

        frame.appendChild(this.__buildIcon())

        const windowName = document.createElement('div')
        windowName.id = "window-name"
        windowName.innerText = this.options.title

        frame.appendChild(windowName)

        frame.appendChild(this.__buildControls())
        frame.appendChild(this.__buildStyle())

        this.frame = frame
    }

    private __buildFrame() {
        const {
            darkMode,
            colors = {},
            frameStyle
        } = this.options

        const colorsArray = Object.entries(colors)

        const frame = document.createElement('div')
        frame.id = "electron-frame"

        frame.classList.add(darkMode ? "dark" : "light")
        frame.classList.add(`${frameStyle}-style`)

        if (!colorsArray.length) {
            frame.classList.add('custom')
        }

        return frame
    }

    private __buildIcon() {
        const {
            icon,
            frameStyle
        } = this.options

        const isWindowsStyle = frameStyle === "windows"

        const frameIcon = document.createElement('div')
        frameIcon.id = isWindowsStyle ? "window-icon" : "spacer"

        if (isWindowsStyle) {
            if (icon instanceof Image) {
                frameIcon.appendChild(icon)
            } else if (icon !== "") {
                const image = new Image()
                image.src = icon

                frameIcon.appendChild(image)
            }
        }

        return frameIcon
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
        const windowConfig = this.__getWindowConfig()

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