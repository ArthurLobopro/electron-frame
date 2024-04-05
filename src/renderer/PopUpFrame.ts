import { ipcRenderer } from "electron"
import { Frame, frameColors, frameStyle, windowConfig } from "./Frame"

interface PopUpFrameOptions {
    darkMode: boolean
    minimizable: boolean
    maximizable: boolean
    closeable: boolean
    colors: frameColors
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
        const windowConfig = ipcRenderer.sendSync('electron-frame:request-window-config') as windowConfig

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
        type MouseMoveProps = DOMRect & { pageX: number, pageY: number }

        const windowsMouseMove = (props: MouseMoveProps) => {
            const { pageX, pageY, x, y, height } = props

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

        const macosMouseMove = (props: MouseMoveProps) => {
            const { pageY, pageX, x, y, height, width } = props

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

            const props = {
                pageX,
                pageY,
                ...this.frame.getBoundingClientRect()
            }

            this.options.frameStyle === "windows" ? windowsMouseMove(props) : macosMouseMove(props)
        })
    }
}