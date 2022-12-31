const { contextBridge } = require('electron')
const { ElectronFrame, PopUpFrame } = require('electron-frame/renderer')

const icon = new Image()
icon.src = "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/microsoft/209/waving-hand-sign_1f44b.png"

let frameStyle = "windows"
let frameType = "electron"

const frames = {
    "popup": PopUpFrame,
    "electron": ElectronFrame
}

let frame = new ElectronFrame({
    frameStyle,
    icon: icon,
})

const debug = {
    insertFrame: () => {
        frame.insert()
    },
    removeFrame: () => {
        frame.remove()
    },
    toggleFrameType() {
        frameType = frameType === "popup" ? "electron" : "popup"
        debug.reinsert()
    },
    toggleFrameStyle() {
        if (frameStyle === "windows") {
            frameStyle = "macos"
        } else {
            frameStyle = "windows"
        }
        frame.frameStyle = frameStyle
    },
    toggleDarkMode() {
        frame.toggleDarkMode()
    },
    reinsert() {
        frame.remove()
        frame = new frames[frameType]({
            frameStyle: frameStyle
        })
        frame.insert()
    },
    update() {
        frame.update()
    }
}


contextBridge.exposeInMainWorld('debug', debug)

window.addEventListener('DOMContentLoaded', () => {


    // frame.setIcon(icon)
    frame.insert()

    const selec_style = document.getElementById("style")
    selec_style.value = frameStyle
    selec_style.addEventListener("change", () => {
        debug.toggleFrameStyle()
    })

    const select_type = document.getElementById("type")
    select_type.value = frameType
    select_type.addEventListener("change", () => {
        debug.toggleFrameType()
    })

    const dark_mode = document.getElementById("darkmode")
    dark_mode.checked = frame.darkMode
    dark_mode.addEventListener("change", () => {
        debug.toggleDarkMode()
    })
})