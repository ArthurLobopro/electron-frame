const { contextBridge } = require('electron')
const { insertFrame, ElectronFrame, PopUpFrame, removeFrame } = require('electron-frame/renderer')

// const frame = new ElectronFrame({
//     frameStyle: "macos"
// })

let frameStyle = "windows"
let frameType = "popup"

const frames = {
    "popup": PopUpFrame,
    "electron": ElectronFrame
}

let frame = new PopUpFrame({
    frameStyle
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
        frame.update()
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
})