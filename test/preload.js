const { contextBridge } = require('electron')
const { insertFrame, electronFrame, removeFrame } = require('electron-frame/renderer')

const frame = new electronFrame()

window.addEventListener('DOMContentLoaded', () => {
    // const icon = new Image()
    // icon.src = "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/microsoft/209/waving-hand-sign_1f44b.png"
    // insertFrame({
    //     icon,
    //     onClose: {
    //         // beforeCallback: () => Math.random() > 0.8
    //         //If the condition is true, the window will close
    //     }
    // })
    frame.insert()
    setTimeout(() => {
        // const icon = new Image()
        // icon.src = "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/microsoft/209/waving-hand-sign_1f44b.png"
        // frame.setIcon(icon)
        // frame.setColors({background: '#eee'})
        removeFrame()
    }, 10000);
})