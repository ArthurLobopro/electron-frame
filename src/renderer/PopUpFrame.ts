import { ipcRenderer } from "electron"
import { actions } from "./actions"
import { icons } from "./icons"
import { format, injectCSS } from "./Util"

interface makePopUpFrameOptions {
    darkMode?: boolean
    minimizable: boolean
    maximizable: boolean
    closeable: boolean
    colors?: frameColors
    frameStyle?: frameStyle
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

interface windowConfig {
    minimizable: boolean
    maximizable: boolean
    closeable: boolean
}

interface PopUpFrameOptions {
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

export class PopUpFrame {

    frame!: HTMLDivElement
    options: PopUpFrameOptions

    constructor(frameOptions: makePopUpFrameOptions) {
        const windowConfig = ipcRenderer.sendSync('request-window-config') as windowConfig
        const defaultConfig: makePopUpFrameOptions = {
            darkMode: true,
            colors: {},
            frameStyle: "windows",
            onClose: { beforeCallback() { return true }, },
            ...windowConfig
        }
        this.options = { ...defaultConfig, ...frameOptions } as PopUpFrameOptions
        this._build()
    }

    toggleExpandIcon() {
        if (this.options.frameStyle === "macos") {
            const expand_div = this.frame.querySelector("#expand") as HTMLElement
            //Ao inserir o svg dentro de um elemento html ele muda, isso é realmente necessário para comparação
            const temp_div = document.createElement('div')
            temp_div.innerHTML = icons.macos.expand
            expand_div.innerHTML = expand_div.innerHTML.trim() == temp_div.innerHTML.trim() ? icons.macos.restore : icons.macos.expand
        }
    }

    async insert() {
        //Rebuild with DOM content
        this._build()

        injectCSS(__dirname, 'style.css')
        document.body.appendChild(this.frame)
        this._setEvents()
    }

    private _build() {

        if (process.platform === "linux") {
            throw new Error("PopUpFrame is not supported on Linux")
        }

        const {
            darkMode = true, minimizable = true, maximizable = true, closeable = true,
            colors = {},
            frameStyle
        } = this.options

        const properties = this._buildStyle()

        const isWindowsStyle = frameStyle === "windows"

        const PopUpFrame = document.createElement('div')
        PopUpFrame.id = 'electron-popup-frame'

        PopUpFrame.classList.add(darkMode ? "dark" : "light")
        PopUpFrame.classList.add(isWindowsStyle ? "windows-style" : "macos-style")

        PopUpFrame.innerHTML = `
        <div id="minimize" class="frame-button ${minimizable ? "" : "disable"}">
            ${icons[frameStyle].minimize}
        </div>
        <div id="expand" class="frame-button ${maximizable ? "" : "disable"}">
            ${icons[frameStyle].expand}
        </div>
        <div id="close" class="frame-button ${closeable ? "" : "disable"}">
            ${icons[frameStyle].close}
        </div>
        
        <style>
            #electron-frame.custom {
                ${properties}
            }
        </style>`

        this.frame = PopUpFrame
    }

    setColors(colors: frameColors) {
        this.options.colors = {
            ...this.options.colors,
            ...colors
        }
        this._updateStyle()
    }

    private _setEvents() {
        const frameGet = (id: string) => this.frame.querySelector(`#${id}`) as HTMLElement

        const hideMenu = () => this.frame.classList.remove('active')

        frameGet('minimize').onclick = () => {
            actions.minimize(this)
            hideMenu()
        }
        frameGet('expand').onclick = () => {
            actions.expand(this)
            hideMenu()
        }
        frameGet('close').onclick = () => {
            actions.close(this)
            hideMenu()
        }

        const windowsMouseMove = ({ pageX, pageY, x, y, height }: { pageX: number, pageY: number, x: number, y: number, height: number }) => {
            if (pageY <= 10 && pageX > x) {
                if (!this.frame.classList.contains('active')) {
                    this.frame.classList.add('active')
                }
            }

            if (pageY > y + height + 10 || pageX < x) {
                if (this.frame.classList.contains('active')) {
                    hideMenu()
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
                    hideMenu()
                }
            }
        }

        window.addEventListener('mousemove', event => {
            const { pageX, pageY } = event
            const { x, height, y, width } = this.frame.getBoundingClientRect()

            this.options.frameStyle === "windows" ? windowsMouseMove({ pageX, pageY, x, y, height }) : macosMouseMove({ pageX, pageY, x, y, height, width })
        })
    }

    private _updateStyle() {
        const properties = this._buildStyle()
        const styleTag = this.frame.querySelector('style') as HTMLElement
        styleTag.innerHTML = `#electron-frame.custom {${properties}}`

        if (!this.frame.classList.contains("custom")) {
            this.frame.classList.add("custom")
        }
    }

    private _buildStyle() {
        const { colors = {} } = this.options

        const colorsArray = Object.entries(colors)
        const properties = colorsArray.map(([key, value]) => `--${format(key)} : ${value} !important`).join(';')

        return properties
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