import { ipcRenderer } from "electron"
import { icons } from "./icons"
import { format } from "./Util"

const os = process.platform === "darwin" ? "macos" : process.platform === "win32" ? "windows" : "linux"

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

    private _build() {

        if (os === "linux") {
            throw new Error("PopUpFrame is not supported on Linux")
        }

        const {
            darkMode = true, minimizable = true, maximizable = true, closeable = true,
            colors = {},
            frameStyle
        } = this.options

        const properties = this._buildStyle()

        const PopUpFrame = document.createElement('div')
        PopUpFrame.id = 'window-controls-wrapper'

        PopUpFrame.innerHTML = `
        <div id="minimize" class="frame-button ${minimizable ? "" : "disable"}">
            ${icons[os].minimize})}
        </div>
        <div id="expand" class="frame-button ${maximizable ? "" : "disable"}">
            ${icons[os].expand})}
        </div>
        <div id="close" class="frame-button ${closeable ? "" : "disable"}">
            ${icons[os].close})}
        </div>
        
        <style>
            #electron-frame.custom {
                ${properties}
            }
        </style>`

        this.frame = PopUpFrame
    }

    private _buildStyle() {
        const { colors = {} } = this.options

        const colorsArray = Object.entries(colors)
        const properties = colorsArray.map(([key, value]) => `--${format(key)} : ${value} !important`).join(';')

        return properties
    }
}