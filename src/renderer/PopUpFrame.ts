import { Frame, FrameColors, frameStyle } from "./Frame"

interface PopUpFrameOptions {
    darkMode: boolean
    minimizable: boolean
    maximizable: boolean
    closeable: boolean
    colors: FrameColors
    frameStyle: frameStyle
    onClose?: {
        beforeCallback?: () => boolean | Promise<boolean>
    }
}

interface makePopUpFrameOptions extends Partial<PopUpFrameOptions> {
    autoInsert?: boolean
    tabIndex?: false
}


export class PopUpFrame extends Frame {
    options!: PopUpFrameOptions

    constructor(frameOptions: makePopUpFrameOptions = {}) {
        super()

        const autoInsert = frameOptions?.autoInsert || false
        delete frameOptions.autoInsert

        this.__resolveOptions(frameOptions)
        this.__build()

        if (autoInsert) {
            this.insert()
        }
    }

    protected __resolveOptions(options: makePopUpFrameOptions) {
        const windowConfig = this.__getWindowConfig()

        const defaultConfig: makePopUpFrameOptions = {
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

    protected __build() {
        if (process.platform === "linux") {
            console.warn("PopUpFrame is not recommended on Linux")
        }

        const {
            darkMode = true,
            frameStyle
        } = this.options

        const isWindowsStyle = frameStyle === "windows"

        const PopUpFrame = document.createElement('div')
        PopUpFrame.id = 'electron-popup-frame'

        PopUpFrame.classList.add(darkMode ? "dark" : "light")
        PopUpFrame.classList.add(isWindowsStyle ? "windows-style" : "macos-style")

        PopUpFrame.appendChild(this.__buildButton("minimize"))
        PopUpFrame.appendChild(this.__buildButton("expand"))
        PopUpFrame.appendChild(this.__buildButton("close"))

        PopUpFrame.appendChild(this.__buildStyle())

        this.frame = PopUpFrame
        this.__setEvents()
    }

    protected __hideMenu() {
        this.frame.classList.remove('active')
    }

    protected __getFrameElement(id: string) {
        return this.frame.querySelector(`#${id}`) as HTMLElement
    }

    protected __minimize(): void {
        super.__minimize()
        this.__hideMenu()
    }

    protected __expand(): void {
        super.__expand()
        this.__hideMenu()
    }

    protected async __close() {
        await super.__close()
        this.__hideMenu()
    }

    protected __setEvents() {
        const windowsMouseMove = ({ pageX, pageY, x, y, height }: { pageX: number, pageY: number, x: number, y: number, height: number }) => {
            if (pageY <= 10 && pageX > x) {
                if (!this.frame.classList.contains('active')) {
                    this.frame.classList.add('active')
                }
            }

            if (pageY > y + height + 10 || pageX < x) {
                if (this.frame.classList.contains('active')) {
                    this.__hideMenu()
                }
            }
        }

        const macosMouseMove = ({ pageY, pageX, x, y, height, width }: { pageX: number, pageY: number, x: number, y: number, height: number, width: number }) => {
            if (pageY <= 10 && pageX < x + width) {
                if (!this.frame.classList.contains('active')) {
                    this.frame.classList.add('active')
                }
            }

            if (pageY > y + height + 15 || pageX > x + width + 10) {
                if (this.frame.classList.contains('active')) {
                    this.__hideMenu()
                }
            }
        }

        window.addEventListener('mousemove', event => {
            const { pageX, pageY } = event
            const { x, height, y, width } = this.frame.getBoundingClientRect()

            this.options.frameStyle === "windows" ? windowsMouseMove({ pageX, pageY, x, y, height }) : macosMouseMove({ pageX, pageY, x, y, height, width })
        })
    }
}