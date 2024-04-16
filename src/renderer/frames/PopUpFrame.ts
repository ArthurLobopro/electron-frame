import { PopUpFrameActions } from "../actions/PopUpFrameActions"
import { PopUpFrameBuilder } from "../builders/PopUpFrameBuilder"
import { BaseFrameOptions, Frame } from "./Frame"

interface PopUpFrameOptions extends BaseFrameOptions {
    darkMode: boolean
    onClose?: {
        beforeCallback?: () => boolean | Promise<boolean>
    }
}

export interface MakePopUpFrameOptions extends Partial<PopUpFrameOptions> {
    autoInsert?: boolean
}

export class PopUpFrame extends Frame<PopUpFrameOptions, MakePopUpFrameOptions> {
    actions = new PopUpFrameActions(this)
    builder: PopUpFrameBuilder

    constructor(frameOptions?: PopUpFrameOptions) {
        super()
        this.builder = new PopUpFrameBuilder(this)
        this.__init(frameOptions)
    }

    protected __resolveOptions(options: MakePopUpFrameOptions) {
        const windowConfig = this.__getWindowConfig()

        const defaultConfig: MakePopUpFrameOptions = {
            darkMode: true,
            colors: {},
            frameStyle: "windows",
            onClose: { beforeCallback() { return true }, },
            ...windowConfig,
            tabIndex: false
        }

        this.options = {
            ...defaultConfig,
            ...options
        } as PopUpFrameOptions
    }

    protected __build(): void {
        this.builder.build()
    }

    hide() {
        this.frame.classList.remove('active')
    }
}