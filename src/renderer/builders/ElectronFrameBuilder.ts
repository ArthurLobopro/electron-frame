import { ElectronFrame } from "../frames/ElectronFrame"
import { FrameBuilder } from "./FrameBuilder"

export class ElectronFrameBuilder extends FrameBuilder {
    constructor(protected frame: ElectronFrame) {
        super(frame)
    }

    build() {
        const frame = this.__buildFrame()

        frame.appendChild(this.__buildIcon())

        const windowName = document.createElement('div')
        windowName.id = "window-name"
        windowName.innerText = this.frame.options.title

        frame.appendChild(windowName)

        frame.appendChild(this.__buildControls())
        frame.appendChild(this.__buildStyle())

        this.frame.frame = frame
    }

    private __buildFrame() {
        const {
            darkMode,
            colors = {},
            frameStyle
        } = this.frame.options

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
        } = this.frame.options

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
}