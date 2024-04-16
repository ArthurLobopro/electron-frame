import { FrameActions } from "../actions/FrameActions"
import { ElectronFrameBuilder } from "../builders/ElectronFrameBuilder"
import { getIcon } from '../Util'
import { BaseFrameOptions, Frame } from "./Frame"

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
    builder: ElectronFrameBuilder
    actions: FrameActions = new FrameActions(this)

    constructor(frameOptions?: ElectronFrameOptions) {
        super()
        this.builder = new ElectronFrameBuilder(this)
        this.__init(frameOptions)
    }

    protected __build() {
        this.builder.build()
    }

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