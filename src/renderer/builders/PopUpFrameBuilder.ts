import { PopUpFrame } from "../frames/PopUpFrame"
import { FrameBuilder } from "./FrameBuilder"

export class PopUpFrameBuilder extends FrameBuilder {
    constructor(protected frame: PopUpFrame) {
        super(frame)
    }

    build() {
        if (process.platform === "linux") {
            console.warn("PopUpFrame is not recommended on Linux")
        }

        const {
            darkMode = true,
            frameStyle
        } = this.frame.options

        const isWindowsStyle = frameStyle === "windows"

        const PopUpFrame = document.createElement('div')
        PopUpFrame.id = 'electron-popup-frame'

        PopUpFrame.classList.add(darkMode ? "dark" : "light")
        PopUpFrame.classList.add(isWindowsStyle ? "windows-style" : "macos-style")

        PopUpFrame.appendChild(this.__buildButton("minimize"))
        PopUpFrame.appendChild(this.__buildButton("expand"))
        PopUpFrame.appendChild(this.__buildButton("close"))

        PopUpFrame.appendChild(this.__buildStyle())

        this.frame.frame = PopUpFrame
        this.__setEvents()
    }

    protected __setEvents() {
        const windowsMouseMove = ({ pageX, pageY, x, y, height }: { pageX: number, pageY: number, x: number, y: number, height: number }) => {
            if (pageY <= 10 && pageX > x) {
                if (!this.frame.frame.classList.contains('active')) {
                    this.frame.frame.classList.add('active')
                }
            }

            if (pageY > y + height + 10 || pageX < x) {
                this.frame.hide()
            }
        }

        const macosMouseMove = ({ pageY, pageX, x, y, height, width }: { pageX: number, pageY: number, x: number, y: number, height: number, width: number }) => {
            if (pageY <= 10 && pageX < x + width) {
                if (!this.frame.frame.classList.contains('active')) {
                    this.frame.frame.classList.add('active')
                }
            }

            if (pageY > y + height + 15 || pageX > x + width + 10) {
                this.frame.hide()
            }
        }

        window.addEventListener('mousemove', event => {
            const { pageX, pageY } = event
            const { x, height, y, width } = this.frame.frame.getBoundingClientRect()

            this.frame.options.frameStyle === "windows" ? windowsMouseMove({ pageX, pageY, x, y, height }) : macosMouseMove({ pageX, pageY, x, y, height, width })
        })
    }
}