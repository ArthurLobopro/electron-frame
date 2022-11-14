const { contextBridge } = require('electron')
const { insertFrame, ElectronFrame, PopUpFrame, removeFrame } = require('electron-frame/renderer')

// const frame = new ElectronFrame({
//     frameStyle: "macos"
// })

let frameStyle = "windows"
let frameType = "electron"

const frames = {
    "popup": PopUpFrame,
    "electron": ElectronFrame
}

let frame = new ElectronFrame({
    frameStyle,
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
    const icon = new Image()
    icon.src = "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/microsoft/209/waving-hand-sign_1f44b.png"
    // insertFrame({
    //     icon,
    //     onClose: {
    //         // beforeCallback: () => Math.random() > 0.8
    //         //If the condition is true, the window will close
    //     }
    // })
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